const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  schedule_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  noi_dung: { type: String, required: true },
  thoi_gian: { type: Date, default: Date.now }
  
});

module.exports = mongoose.model('Notification', NotificationSchema);
