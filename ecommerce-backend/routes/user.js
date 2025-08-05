const express = require('express');
const router = express.Router();
const { protect } = require('../utils/middleware/authMiddleWare');
const userController = require('../controllers/userController');

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);

module.exports = router;
