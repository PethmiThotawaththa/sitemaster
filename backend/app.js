const express = require('express');
const app = express();
// ... other imports

const adminRoutes = require('./routes/adminRoutes');

// ... other middleware

// Use admin routes
app.use('/api/admin', adminRoutes);

// ... rest of your app configuration 