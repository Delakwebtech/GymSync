const dotenv = require("dotenv");

// Load env vars
const path = require("path");
dotenv.config({ path: "./config/config.env" });

const express = require("express");
const cookieParser = require("cookie-parser");

// Connect to database
const sequelize = require("./config/db");
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');

    // Sync models and create tables if not exist
    // return sequelize.sync();
  
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1); 
  });

// Route files
const customerRoutes = require('./routes/customers');
const instructorRoutes = require('./routes/instructors');

const app = express();

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Mount routers
app.use('/api/customers', customerRoutes);
app.use('/api/instructors', instructorRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server and exit process
    server.close(() => process.exit(1)); 
});