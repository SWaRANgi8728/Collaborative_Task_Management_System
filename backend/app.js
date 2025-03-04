const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // To handle CORS if you're working with front-end and back-end separately
const Project = require('./models/projectModel');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors()); // Enable CORS if required for cross-origin requests

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ctms', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error: ', err));

// Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  dueDate: Date,
  priority: String,
  assignee: String,
  reporter: String,
  status: String,
});

// Task Model
const Task = mongoose.model('Task', taskSchema);

// API routes

// Create Task
app.post('/api/tasks', async (req, res) => {
  const { title, dueDate, priority, assignee, reporter, status } = req.body;
  const task = new Task({ title, dueDate, priority, assignee, reporter, status });

  try {
    const savedTask = await task.save();
    console.log('Task created:', savedTask); // Log the created task
    res.status(201).json(savedTask);
  } catch (err) {
    console.error('Error creating task:', err); // Log error
    res.status(400).json({ error: 'Error creating task' });
  }
});

// Get All Tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err); // Log error
    res.status(400).json({ error: 'Error fetching tasks' });
  }
});

// Get Task by ID
app.get('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (err) {
    console.error('Error fetching task:', err); // Log error
    res.status(400).json({ error: 'Error fetching task' });
  }
});

// Update Task
app.put('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    console.log('Task updated:', updatedTask); // Log the updated task
    res.status(200).json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err); // Log error
    res.status(400).json({ error: 'Error updating task' });
  }
});

// Delete Task
app.delete('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    console.log('Task deleted:', deletedTask); // Log the deleted task
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err); // Log error
    res.status(400).json({ error: 'Error deleting task' });
  }
});

const userRoutes = require('./routes/userRoutes'); 
// Use user routes
app.use('/api/users', userRoutes);

const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects', projectRoutes);



app.post('/api/projects', async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const newProject = new Project({ name, description, members });
    await newProject.save();

    res.status(201).json(newProject); // Sending a JSON response after creating a project
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: 'Failed to create project' }); // Send JSON on error
  }
});


// Route for creating a new project
app.post('/api/projects/create', async (req, res) => {
  console.log('POST /api/projects/create request received');  // Debugging log
  try {
    const { name, description, members } = req.body;
    
    // Ensure these fields are provided
    if (!name || !description || !Array.isArray(members)) {
      return res.status(400).json({ error: 'Name, description, and members are required' });
    }

    const newProject = new Project({ name, description, members });
    await newProject.save();
    
    res.status(201).json(newProject);  // Send back the created project
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ error: 'Failed to create project' });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
