const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const router = express.Router();

// Load the proto file
const PROTO_PATH = __dirname + '/search.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const searchProto = grpc.loadPackageDefinition(packageDefinition).search;

// Initializing gRPC client
const grpcClient = new searchProto.SearchService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);


router.post('/search', (req, res) => {
  const query = req.body.query || '';
  const page = req.body.page || 1;

  grpcClient.SearchQuestions({ query, page }, (error, response) => {
    if (error) {
      console.error('Error during gRPC request:', error);
      return res.status(500).json({ error: 'Something went wrong' });
    }
    res.json(response);
  });
});


module.exports = router;