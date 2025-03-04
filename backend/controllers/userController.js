// controllers/userController.js
const User = require('../models/userModel');

// Register a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    // Validate input fields
    if (!name || !email || !role || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create a new user
    const newUser = new User({ name, email, role, password });
    await newUser.save();

    // Return the user data (excluding password)
    res.status(201).json({ name: newUser.name, email: newUser.email, role: newUser.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Return user data (excluding password)
    res.status(200).json({ name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
