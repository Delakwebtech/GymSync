const express = require('express');
const { register, login, getMe } = require('../controller/auth');

const router = express.Router();

const {protect} = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getMe);

module.exports = router;
