const express = require('express');
const {
    checkInCustomer,
    getAllAttendance,
    getAttendanceByCustomer,
} = require('../controller/attendance');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Attendance = require('../models/Attendance');
const Customer = require('../models/Customer');

router
  .route('/checkin')
  .post(protect, authorize('superadmin', 'admin'), checkInCustomer)

router
  .route('/')
  .get(
    protect,
    authorize('superadmin', 'admin'),
    advancedResults(Attendance, [
        {
          model: Customer,
          as: 'customer',
          attributes: ['fullName', 'phoneNumber'],
        },
    ]),
    getAllAttendance
  )

router
  .route('/:customerId')
  .post(protect, authorize('superadmin', 'admin'), getAttendanceByCustomer)

module.exports = router;
