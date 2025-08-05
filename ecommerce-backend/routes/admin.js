const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../utils/middleware/authMiddleWare');
const adminController = require('../controllers/adminController');

// Users
router.get('/users', protect, adminOnly, adminController.getAllUsers);
router.get('/users/:id', protect, adminOnly, adminController.getUserById);
router.put('/users/:id', protect, adminOnly, adminController.updateUser);
router.delete('/users/:id', protect, adminOnly, adminController.deleteUser);

// Products
router.get('/products', protect, adminOnly, adminController.getAllProducts);
router.get('/products/:id', protect, adminOnly, adminController.getProductById);
router.post('/products', protect, adminOnly, adminController.createProduct);
router.put('/products/:id', protect, adminOnly, adminController.updateProduct);
router.delete('/products/:id', protect, adminOnly, adminController.deleteProduct);

module.exports = router;
