const mongoose = require('mongoose');

const SubSchema = new mongoose.Schema({
  ten: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sdt: { type: String, required: true },
  password: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sub', SubSchema);
