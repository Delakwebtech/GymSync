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
const advancedResults = require('../middleware/advancedResults');
const User = require('../models/User');

router
  .route('/')
    .post(protect, authorize('superadmin'), createInstructor)
    .get(protect, 
      authorize('superadmin', 'admin'), 
      (req, res, next) => {
        req.query.role = 'instructor';
        next();
      },
      advancedResults(User),
      getAllInstructors
    );

router
  .route('/:id')
    .get(protect, authorize('superadmin', 'admin'), getInstructor)
    .put(protect, authorize('superadmin'), updateInstructor)
    .delete(protect, authorize('superadmin'), deleteInstructor);


module.exports = router;