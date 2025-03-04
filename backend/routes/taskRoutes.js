// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const { createTask, getTasks, getTaskById,  updateTask, deleteTask } = require('../controllers/taskController');

// CRUD Routes
router.post('/', createTask); // Create Task
router.get('/', getTasks); // Get All Tasks
router.get('/:id', getTaskById);
router.put('/:id', updateTask); // Update Task
router.delete('/:id', deleteTask); // Delete Task

module.exports = router;

// Route to get a task by ID
router.get('/:id', getTaskById);



// routes/taskRoutes.js
router.post('/', async (req, res) => {
    console.log('Received data:', req.body); // Debug log to see the incoming request data
  
    const { title, dueDate, priority, assignee, reporter, status } = req.body;
  
    // Validate the incoming data
    if (!title || !dueDate || !priority || !assignee || !reporter || !status) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const task = new Task({
        title,
        dueDate,
        priority,
        assignee,
        reporter,
        status
      });
  
      await task.save();
      return res.status(201).json(task); // Send back the created task
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server Error' });
    }
  });
  

