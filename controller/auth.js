const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { fullName, phoneNumber, email, role, password } = req.body;

    try {
        // Create User
        const user = await User.create({
            fullName,
            phoneNumber,
            email,
            role,
            password
        });

        sendTokenResponse(user, 200, res);
    } catch (error) {
        return next(new ErrorResponse(error.message, 400));
    }
});

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    try {
        // Check for user
        const user = await User.findOne({
            where: { email },
            attributes: ['userId', 'email', 'password'] 
        });

        if (!user) {
            return next(new ErrorResponse('Invalid Credentials', 401));
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(new ErrorResponse('Invalid Credentials', 401));
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        return next(new ErrorResponse(error.message, 500));
    }
});

// @desc    Logged in User
// @route   GET /api/auth/profile
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id); 

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return next(new ErrorResponse(error.message, 500));
    }
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create Token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 3600 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token
    });
};
