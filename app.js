const express = require('express');
const connectDB = require('./db/database');
const reviewRoutes = require('./routes/reviewRoutes');
const responseRoutes = require('./routes/responseRoutes');
const adminRoutes = require('./routes/adminRoutes');  // Add admin routes
const path = require('path');
require('dotenv').config();

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', reviewRoutes);
app.use('/api', responseRoutes);
app.use('/api/admin', adminRoutes);  // Use admin routes

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
