/**
 * Order Controller
 * Handles HTTP requests related to orders.
 */

const Order = require('../models/orderModel');
const Product = require('../models/productModel');

/**
 * Create a new order.
 * Validates that products are not archived before creating the order.
 */
exports.createOrder = async (req, res) => {
  try {
    const { product_id, ...rest } = req.body;
    const product = await Product.getById(product_id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (product.archived) {
      return res.status(400).json({ error: 'Cannot order an archived product' });
    }

    const userId = req.user.id;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order items' });
    }

    const createdOrder = await Order.createOrder(userId, items);
    res.status(201).json(createdOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: err.message });
  }
};


// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const user = getCurrentUser(); // You can get this from the token or request context

  if (user.role === 'user' && Status === 'cancelled') {
    return res.status(403).json({ error: 'Users cannot cancel orders' });
  }

  try {
    const updated = await Order.updateStatus(req.params.id, status);
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted', deleted });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};
