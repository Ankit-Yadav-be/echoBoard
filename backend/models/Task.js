// models/Task.js
const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  githubLink: String,
  youtubeLink: String,
  databaseLink: String,
  deadline: Date,
  reminder: Date, 
  notified: { type: Boolean, default: false },// 🔔 new field
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
