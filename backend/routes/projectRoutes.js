




// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Project Routes
router.post('/create', projectController.createProject); // Route to create a project
router.get('/:id', projectController.getProject); // Route to get a project by its ID
router.get('/', projectController.getAllProjects); // Route to get all projects
router.delete('/:id', projectController.deleteProject); // Route to delete a project by its ID
router.post('/add-remove-members', projectController.addRemoveMembers); // Route to add/remove members

module.exports = router;
