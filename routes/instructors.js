const express = require('express');
const {
    createInstructor,
    getAllInstructors,
    getInstructor,
    updateInstructor,
    deleteInstructor,
} = require('../controller/instructor');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .post(protect, authorize('admin'), createInstructor)
  .get(protect, authorize('admin', 'receptionist'), getAllInstructors);

router
  .route('/:id')
  .get(protect, authorize('admin', 'receptionist'), getInstructor)
  .put(protect, authorize('admin'), updateInstructor)
  .delete(protect, authorize('admin'), deleteInstructor);


module.exports = router;