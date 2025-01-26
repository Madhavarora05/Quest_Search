const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrectAnswer: { type: Boolean, required: true },
});

const questionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  anagramType: { type: String },
  blocks: [
    {
      text: { type: String, required: true },
      showInOption: { type: Boolean, required: true },
      isAnswer: { type: Boolean, required: true },
    },
  ],
  options: [optionSchema],
  siblingId: { type: mongoose.Schema.Types.ObjectId },
  solution: { type: String },
  title: { type: String, required: true },
});

module.exports = mongoose.model('Question', questionSchema);