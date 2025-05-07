const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Customer = require('../models/Customers');

// @desc    Register new customer
// @route   POST /api/customers
// @access  Private
exports.createCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.create(req.body);

    res.status(201).json({ success: true, data: customer });
});

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
exports.getAllCustomers = asyncHandler(async (req, res) => {
    const customers = await Customer.findAll({ include: 'instructor' });

    // If no customers found, return error
    if (!customers) {
        return next(
            new ErrorResponse('No customer found', 404)
        );
    }

    res.status(200).json({ success: true, data: customers });
});

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findByPk(req.params.id, {
      include: 'instructor'
    });

    // If no customers found, return error
    if (!customer) {
        return next(
            new ErrorResponse(`Customer with id ${req.params.id} not found`, 404)
        );
    }

    res.status(200).json({ success: true, data: customer });  
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findByPk(req.params.id);

    // If the customer is not found, return an error
    if (!customer) {
        return next(new ErrorResponse(`Customer with id ${req.params.id} not found`, 404));
    }

    const updatedCustomer = await customer.update(req.body);

    res.status(200).json({ success: true, data: updatedCustomer });    
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
exports.deleteCustomer = asyncHandler(async (req, res) => {
    const customer = await Customer.findByPk(req.params.id);

    // If the customer is not found, return an error
    if (!customer) {
        return next(new ErrorResponse(`Customer with id ${req.params.id} not found`, 404));
    }

    await customer.destroy();

    res.status(200).json({ success: true, data: {} });
});

// @desc    Assign instructor
// @route   POST /api/customers/:id/assign-instructor
// @access  Private
exports.assignInstructor = asyncHandler(async (req, res) => {
    const { instructorId } = req.body;
    
    const customer = await Customer.findByPk(req.params.id);

    // If the customer is not found, return an error
    if (!customer) {
        return next(new ErrorResponse(`Customer with id ${req.params.id} not found`, 404));
    }

    customer.assignedInstructorId = instructorId;
    
    await customer.save();

    res.status(200).json({ success: true, data: customer });
});
