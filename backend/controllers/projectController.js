// controllers/projectController.js
const Project = require('../models/projectModel');
//const User = require('../models/userModel');



// Create a new Project it run
/*exports.createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body; // members should be an array of user IDs
    
    console.log('Request Body:', req.body); // Debugging log

    // Ensure all fields are provided
    if (!name || !description || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: 'Name, description, and members are required' });
    }

    const newProject = new Project({
      name,
      description,
      members,
      createdBy: req.user ? req.user._id : null, // Assuming req.user._id is set by authentication middleware
    });

    await newProject.save();
    res.status(201).json(newProject); // Respond with the new project data
  } catch (error) {
    console.error('Error creating project:', error); // Log error details
    res.status(400).json({ error: error.message }); // Respond with error message
  }
};*/


const User = require('../models/userModel'); // Import user model

exports.createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body; // members should be an array of user IDs

    console.log('Request Body:', req.body); // Debugging log

    // Ensure all fields are provided
    if (!name || !description || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: 'Name, description, and members are required' });
    }

    // Fetch the default user from the database (for example, the first user or an admin user)
    const defaultUser = await User.findOne();  // Fetch the first user from the database
    if (!defaultUser) {
      return res.status(400).json({ error: 'No default user found to assign as creator' });
    }

    // Get the user ID from the found user
    const defaultUserId = defaultUser._id; 

    const newProject = new Project({
      name,
      description,
      members,
      createdBy: defaultUserId, // Assign the fetched user ID to the createdBy field
    });

    await newProject.save();
    res.status(201).json(newProject); // Respond with the new project data
  } catch (error) {
    console.error('Error creating project:', error); // Log error details
    res.status(400).json({ error: error.message }); // Respond with error message
  }
};






// Get Project by ID
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members');
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json(project); // Respond with project details
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('members'); // Retrieve all projects and populate the members array
    res.status(200).json(projects); // Respond with the list of projects
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add/Remove Members from Project
exports.addRemoveMembers = async (req, res) => {
  try {
    const { projectId, memberId, action } = req.body; // action can be 'add' or 'remove'
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    if (action === 'add') {
      project.members.push(memberId);
    } else if (action === 'remove') {
      project.members = project.members.filter(member => member.toString() !== memberId);
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    await project.save();
    res.status(200).json(project); // Respond with the updated project
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add the deleteProject function in controllers/projectController.js
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params; // Extract project ID from the URL parameter
    
    const deletedProject = await Project.findByIdAndDelete(id); // Find and delete the project by ID
    
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' }); // If project not found, return error
    }

    res.status(200).json({ message: 'Project deleted successfully' }); // Return success message
  } catch (error) {
    console.error('Error deleting project:', error); // Log any error
    res.status(500).json({ error: 'Failed to delete project' }); // Return error response if something goes wrong
  }
};



// Update Project
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params; // Extract the project ID from the URL parameter
    const { name, description, members } = req.body; // Extract updated data from the request body

    // Check if all required fields are provided
    if (!name || !description || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({ error: 'Name, description, and members are required' });
    }

    // Find the project by ID and update it
    const updatedProject = await Project.findByIdAndUpdate(
      id, // Project ID
      { name, description, members }, // Updated fields
      { new: true } // Return the updated project
    ).populate('members', 'name email'); // Populate the 'members' field with 'name' and 'email'

    // If project not found
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Return the updated project
    res.json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong while updating the project.' });
  }
};
