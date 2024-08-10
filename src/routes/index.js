// src/routes/index.js
const express = require('express');
const userRoutes = require('./userRoutes');
// Import other routes here as needed

const router = express.Router();

// Define routes
router.use('/auth', userRoutes);

// Export the router
module.exports = router;
