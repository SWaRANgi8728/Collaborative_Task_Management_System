


// models/taskModel.js
/*const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  priority: { type: String, required: true },
  assignee: { type: String, required: true },
  reporter: { type: String, required: true },
  status: { type: String, required: true, enum: ['To-Do', 'In Progress', 'Completed'] }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;*/


const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  priority: String,
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assigned user
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Reporter (creator)
  status: String,
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  files: [{
    fileUrl: String, // URL to the uploaded file
    uploadedAt: { type: Date, default: Date.now }
  }],
  notifications: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Task', taskSchema);
