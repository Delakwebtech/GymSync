const dotenv = require("dotenv");

// Load env vars
// const path = require("path");
dotenv.config({ path: "./config/config.env" });

const express = require("express");
const cookieParser = require("cookie-parser");

// Connect to database
const sequelize = require("./config/db");
sequelize.authenticate()
  .then(() => {
    console.log('Database connected successfully');

    // Load models and call associate methods
    const Customer = require('./models/Customers');
    const Instructor = require('./models/Instructors');
    const Attendance = require('./models/Attendance');

    const models = { Customer, Instructor, Attendance };
    Object.values(models).forEach((model) => {
      if (model.associate) {
        model.associate(models);
      }
    });

    // Sync models and create tables if not exist
    // return sequelize.sync({ force: true });
  
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1); 
  });

// Route files
const authRoutes = require('./routes/auth');
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
app.use('/api/auth', authRoutes);

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