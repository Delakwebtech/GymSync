const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Attendance = require('../models/Attendance');
const Customer = require('../models/Customers');

// @desc    Check in customer
// @route   POST /api/attendance/checkin
// @access  Private
exports.checkInCustomer = asyncHandler(async (req, res, next) => {
    const { customerId } = req.body;

    const customer = await Customer.findByPk(customerId);

    if (!customer) {
        return next(
            new ErrorResponse(`Customer with id ${customerId} not found`, 404)
        );
    }

    // Log attendance
    const attendance = await Attendance.create({ customerId });

    // Update customer's lastCheckIn
    customer.lastCheckIn = attendance.timestamp;
    customer.status = 'active';
    await customer.save();

    res.status(201).json({ success: true, data: attendance });
});

// @desc    Get all attendance logs
// @route   GET /api/attendance
// @access  Private
exports.getAllAttendance = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults);
});

// @desc    Get attendance by customer
// @route   GET /api/attendance/:customerId
// @access  Private
exports.getAttendanceByCustomer = asyncHandler(async (req, res, next) => {
    const { customerId } = req.params;

    const logs = await Attendance.findAll({
      where: { customerId },
      order: [['timestamp', 'DESC']],
    });

    res.status(200).json({ count: logs.length, logs });
});