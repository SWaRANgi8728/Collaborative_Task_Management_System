const Task = require('../models/taskModel');
//const Project = require('../models/projectModel');
//const User = require('../models/userModel');




// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status, priority, assignee, reporter } = req.body;

    // Validate assignee and reporter are valid users
    const assigneeUser = await User.findById(assignee);
    if (!assigneeUser) {
      return res.status(400).json({ error: 'Assignee is not a valid user' });
    }

    const reporterUser = await User.findById(reporter);
    if (!reporterUser) {
      return res.status(400).json({ error: 'Reporter is not a valid user' });
    }
    
    const newTask = new Task({ title, description, dueDate, status, priority, assignee, reporter });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

// Get All Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



// Update Task
exports.updateTask = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, dueDate, priority, assignee, reporter, status } = req.body;
  
      // Make sure all fields are present
      if (!title || !dueDate || !priority || !assignee || !reporter || !status) {
        return res.status(400).json({ error: 'All fields are required' });
      }
  
      const updatedTask = await Task.findByIdAndUpdate(id, {
        title,
        dueDate,
        priority,
        assignee,
        reporter,
        status
      }, { new: true });
  
      if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
  
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
