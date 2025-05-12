const express = require('express');
const { login, getMe } = require('../controller/auth');

const router = express.Router();

const {protect} = require('../middleware/auth');

router.post('/login', login);
router.get('/profile', protect, getMe);

module.exports = router;
