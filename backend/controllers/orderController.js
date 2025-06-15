const Order = require('../models/orderModel');

// Create a new order
exports.createOrder = async (req, res) => {
  const { user_id, status, items } = req.body;
  try {
    const order = await Order.create(user_id, status, items);
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAll();
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
