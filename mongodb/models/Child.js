const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  child_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  birth_date: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Nam', 'Nữ'],
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Child", childSchema);
