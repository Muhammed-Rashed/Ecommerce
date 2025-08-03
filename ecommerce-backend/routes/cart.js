const router = require('express').Router();
const { protect } = require('../utils/middleware/authMiddleWare');
const {
  getCart,
  addToCart,
  removeFromCart
} = require('../controllers/cartController');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.post('/remove', protect, removeFromCart);

module.exports = router;
