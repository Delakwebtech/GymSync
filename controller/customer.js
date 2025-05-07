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

    res.status(200).json({ success: true, data: customers });
});

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id, {
      include: 'instructor'
    });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.status(200).json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    await customer.update(req.body);
    res.status(200).json({ success: true, data: customer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    await customer.destroy();
    res.status(200).json({ success: true, message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Assign instructor
exports.assignInstructor = async (req, res) => {
  try {
    const { instructorId } = req.body;
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    customer.assignedInstructorId = instructorId;
    await customer.save();

    res.status(200).json({ success: true, data: customer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
