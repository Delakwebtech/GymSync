const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Register new instructor
// @route   POST /api/instructors
// @access  Private
exports.createInstructor = asyncHandler(async (req, res, next) => {
    
    const { fullName, phoneNumber, email, password } = req.body;

    // Create new user with role 'instructor'
    const instructor = await User.create({
      fullName,
      phoneNumber,
      email,
      password,
      role: 'instructor'
    });
    
    // const instructor = await User.create(req.body);

    res.status(201).json({ success: true, data: instructor });
});

// @desc    Get all instructors
// @route   GET /api/instructors
// @access  Private
exports.getAllInstructors = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults);
});

// @desc    Get single instructor
// @route   GET /api/instructors/:id
// @access  Private
exports.getInstructor = asyncHandler(async (req, res, next) => {
    const instructor = await User.findOne({ 
        where: { userId: req.params.id, role: 'instructor' } 
    });

    // If no instructor found, return error
    if (!instructor) {
        return next(
            new ErrorResponse(`Instructor with id ${req.params.id} not found`, 404)
        );
    }

    res.status(200).json({ success: true, data: instructor });

});
  
// @desc    Update instructor
// @route   PUT /api/instructors/:id
// @access  Private
exports.updateInstructor = asyncHandler(async (req, res, next) => {
    const instructor = await User.findOne({ 
        where: { userId: req.params.id, role: 'instructor' } 
    });

    // If the instructor is not found, return an error
    if (!instructor) {
        return next(
            new ErrorResponse(`Instructor with id ${req.params.id} not found`, 404)
        );
    }

    const updatedInstructor = await instructor.update(req.body);
    
    res.status(200).json({ success: true, data: updatedInstructor });
});
  
// @desc    Delete instructor
// @route   DELETE /api/instructors/:id
// @access  Private
exports.deleteInstructor = asyncHandler(async (req, res, next) => {
    const instructor = await User.findOne({ 
        where: { userId: req.params.id, role: 'instructor' } 
    });

    // If the customer is not found, return an error
    if (!instructor) {
        return next(new ErrorResponse(`Instructor with id ${req.params.id} not found`, 404));
    }

    await instructor.destroy();

    res.status(200).json({ success: true, data: {} });
});