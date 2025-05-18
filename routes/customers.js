const express = require('express');
const {
    createCustomer,
    getAllCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer,
    assignInstructor,
} = require('../controller/customer');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Customer = require('../models/Customers');
const User = require('../models/User');
const advancedResults = require('../middleware/advancedResults');

// Admin or receptionist only
router
  .route('/')
  .post(protect, authorize('superadmin', 'admin'), createCustomer)
  .get(protect, authorize('superadmin', 'admin'), advancedResults(Customer, 'instructor'), getAllCustomers);

router
  .route('/:id')
  .get(protect, authorize('superadmin', 'admin', 'instructor'), getCustomer)
  .put(protect, authorize('superadmin', 'admin'), updateCustomer)
  .delete(protect, authorize('superadmin'), deleteCustomer);

// Assign instructor
router
  .route('/:id/assign-instructor')
  .put(protect, authorize('superadmin', 'admin'), assignInstructor);

module.exports = router;
