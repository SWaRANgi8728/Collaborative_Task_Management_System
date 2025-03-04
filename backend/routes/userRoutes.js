/*const express = require('express');
const router = express.Router();
const { createUser, getUser } = require('../controllers/userController');

router.post('/', createUser);
router.get('/:id', getUser);

module.exports = router;*/

// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { createUser, loginUser } = require('../controllers/userController');

// Register a new user
router.post('/register', createUser);

// Login user
router.post('/login', loginUser);

module.exports = router;


