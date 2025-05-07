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

// Admin or receptionist only
router
  .route('/')
  .post(protect, authorize('admin', 'receptionist'), createCustomer)
  .get(protect, authorize('admin', 'receptionist'), getAllCustomers);

router
  .route('/:id')
  .get(protect, authorize('admin', 'receptionist', 'instructor'), getCustomer)
  .put(protect, authorize('admin', 'receptionist'), updateCustomer)
  .delete(protect, authorize('admin'), deleteCustomer);

// Assign instructor
router
  .route('/:id/assign-instructor')
  .put(protect, authorize('admin', 'receptionist'), assignInstructor);

module.exports = router;
