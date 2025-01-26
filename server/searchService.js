const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const Question = require('./Question');

const PROTO_PATH = __dirname + '/search.proto';

// Loading the proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const searchProto = grpc.loadPackageDefinition(packageDefinition).search;

const searchQuestions = async (call, callback) => {
  const query = call.request.query || '';
  const page = call.request.page || 1;
  const pageSize = 10;

  try {
    if (page < 1) throw new Error('Invalid page number');
    const results = await Question.find({ title: { $regex: query, $options: 'i' } })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalResults = await Question.countDocuments({ title: { $regex: query, $options: 'i' } });
    const totalPages = Math.ceil(totalResults / pageSize);

    callback(null, {
      questions: results.map(question => ({
        title: question.title,
        type: question.type,
        ...(question.type === 'ANAGRAM' && { 
          solution: question.solution,
          blocks: question.blocks,
        }),
        ...(question.type === 'MCQ' && { options: question.options }),
      })),
      totalPages,
    });
  } catch (error) {
    console.error('Error in searchQuestions:', error.message);
    callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: error.message,
    });
  }
};

//Initializing the gRPC server
const startServer = () => {
  const server = new grpc.Server();
  server.addService(searchProto.SearchService.service, { SearchQuestions: searchQuestions });

  server.bindAsync('127.0.0.1:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error('Error starting gRPC server:', err);
      return;
    }
    console.log(`gRPC server running on port ${port}`);
  });
};

module.exports = startServer;