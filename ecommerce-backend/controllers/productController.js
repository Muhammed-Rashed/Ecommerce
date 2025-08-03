const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  const query = req.query;
  const filters = {};

  if (query.name) filters.name = { $regex: query.name, $options: 'i' };
  if (query.category) filters.category = query.category;
  if (query.inStock === 'true') filters.quantity = { $gt: 0 };

  const products = await Product.find(filters);
  res.json(products);
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
};
