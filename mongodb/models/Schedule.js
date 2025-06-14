const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  child: { type: mongoose.Schema.Types.ObjectId, ref: 'Child' },
  activity: String,
  description: String,
  startTime: String,
  duration: String,
  repeat: Boolean,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
