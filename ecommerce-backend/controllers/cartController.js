const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');

  if (!cart) return res.json([]);

  const items = cart.items.map(i => ({
    _id: i._id,
    product: i.productId,
    quantity: i.quantity,
    userId: cart.userId
  }));

  res.json(items);
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) cart = new Cart({ userId: req.user._id, items: [] });

  const index = cart.items.findIndex(i => i.productId.equals(productId));
  if (index > -1) {
    cart.items[index].quantity = quantity;
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  res.json(cart);
};

exports.removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const cart = await Cart.findOne({ userId: req.user._id });
  cart.items = cart.items.filter(i => !i.productId.equals(productId));
  await cart.save();
  res.json(cart);
};
