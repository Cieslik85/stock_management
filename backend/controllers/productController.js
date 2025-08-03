const Product = require('../models/productModel');
const Stock = require('../models/stockModel');

exports.createProduct = async (req, res) => {
  try {
    const { quantity, ...productData } = req.body;

    const newProduct = await Product.create(productData);

    await Stock.create(newProduct.id, quantity || 0);

    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error creating product:', err);

    // Check for duplicate SKU error from Postgres
    if (err.code === '23505' && err.constraint === 'products_sku_key') {
      return res.status(400).json({ error: 'SKU already exists. Please use a unique SKU.' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.status(200).json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.params.id, req.body);
    if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Example for Express.js
exports.deleteProduct = async (req, res) => {
  try {
    await Product.remove(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    // Check for foreign key constraint violation (Postgres code 23503)
    if (err.code === '23503') {
      return res.status(400).json({
        error: 'Unable to delete product as it is referenced elsewhere. Please archive the product instead.'
      });
    }
    // Otherwise, send a generic error
    res.status(500).json({ error: 'Internal server error' });
  }
};
