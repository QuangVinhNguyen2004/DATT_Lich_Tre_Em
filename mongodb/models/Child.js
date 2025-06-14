const mongoose = require('mongoose');

const ChildSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: { type: String, enum: ['Nam', 'Nữ'] },
  avatarUrl: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Child', ChildSchema);
