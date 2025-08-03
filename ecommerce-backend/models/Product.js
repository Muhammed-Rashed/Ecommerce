const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  category: String,
  quantity: Number,
  price: Number,
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
