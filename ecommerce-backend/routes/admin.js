const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../utils/middleware/authMiddleWare');
const adminController = require('../controllers/adminController');
const Cart = require('../models/Cart');

// Users
router.get('/users', protect, adminOnly, adminController.getAllUsers);
router.post('/users', protect, adminOnly, adminController.createUser);
router.get('/users/:id', protect, adminOnly, adminController.getUserById);
router.put('/users/:id', protect, adminOnly, adminController.updateUser);
router.delete('/users/:id', protect, adminOnly, adminController.deleteUser);
router.get('/users/:id/cart', protect, adminOnly, adminController.getUserCart);

router.put('/users/:id/cart', protect, adminOnly, adminController.updateUserCartItem);
router.delete('/users/:id/cart/:productId', protect, adminOnly, adminController.removeUserCartItem);


// Products
router.get('/products', protect, adminOnly, adminController.getAllProducts);
router.get('/products/:id', protect, adminOnly, adminController.getProductById);
router.post('/products', protect, adminOnly, adminController.createProduct);
router.put('/products/:id', protect, adminOnly, adminController.updateProduct);
router.delete('/products/:id', protect, adminOnly, adminController.deleteProduct);

module.exports = router;
