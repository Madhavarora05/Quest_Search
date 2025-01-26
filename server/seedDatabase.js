require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('./Question');
const fs = require('fs');
const path = require('path');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Question.deleteMany();

    // Loading data from json file
    const dataPath = path.join(__dirname, './speakx_questions.json');
    const questionsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const transformedData = questionsData.map(question => {
      const validOptions = question.options?question.options.filter(option => option.text && option.text.trim() !== ''): [];

      return {
        ...question,
        _id: new mongoose.Types.ObjectId(question._id.$oid),
        siblingId: question.siblingId ? new mongoose.Types.ObjectId(question.siblingId.$oid) : null,
        options: validOptions,
      };
    });

    // Inserting new data
    await Question.insertMany(transformedData);
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();