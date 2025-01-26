const express = require('express');
const mongoose = require('mongoose');
const startServer = require('./searchService');
const cors = require('cors');
const router = require('./route');

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/quest-search';
mongoose.connect(MONGO_URI).
  then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Starting the gRPC server
startServer();


const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});