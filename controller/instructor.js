const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Customer = require('../models/Customers');
const Instructor = require('../models/Instructors');

// @desc    Register new instructor
// @route   POST /api/instructors
// @access  Private
exports.createInstructor = asyncHandler(async (req, res, next) => {
    const instructor = await Instructor.create(req.body);

    res.status(201).json({ success: true, data: instructor });
});

// @desc    Get all instructors
// @route   GET /api/instructors
// @access  Private
exports.getAllInstructors = asyncHandler(async (req, res, next) => {
    const instructors = await Instructor.findAll({ include: 'customers' });

    // If no instructors found, return error
    if (!instructors) {
        return next(
            new ErrorResponse('No instructor found', 404)
        );
    }

    res.status(200).json({ success: true, data: instructors });
});

// @desc    Get single instructor
// @route   GET /api/instructors/:id
// @access  Private
exports.getInstructor = asyncHandler(async (req, res, next) => {
    const instructor = await Instructor.findByPk(req.params.id, {
        include: 'customers',
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
    const instructor = await Instructor.findByPk(req.params.id);

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
    const instructor = await Instructor.findByPk(req.params.id);

    // If the customer is not found, return an error
    if (!instructor) {
        return next(new ErrorResponse(`Instructor with id ${req.params.id} not found`, 404));
    }

    await instructor.destroy();

    res.status(200).json({ success: true, data: {} });
});