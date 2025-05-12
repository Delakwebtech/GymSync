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
  .post(protect, authorize('superadmin'), createInstructor)
  .get(protect, authorize('superadmin', 'admin'), getAllInstructors);

router
  .route('/:id')
  .get(protect, authorize('superadmin', 'admin'), getInstructor)
  .put(protect, authorize('superadmin'), updateInstructor)
  .delete(protect, authorize('superadmin'), deleteInstructor);


module.exports = router;