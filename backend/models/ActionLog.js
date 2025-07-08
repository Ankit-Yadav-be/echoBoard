const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema({
  actionType: {
    type: String, // e.g., "create", "update", "delete"
    required: true,
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('ActionLog', actionLogSchema);
