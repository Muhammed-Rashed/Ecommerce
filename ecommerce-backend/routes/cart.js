const router = require('express').Router();
const { protect } = require('../utils/middleware/authMiddleWare');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.post('/remove', protect, removeFromCart);
router.delete('/clear', protect, clearCart);

module.exports = router;
