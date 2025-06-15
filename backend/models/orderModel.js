// models/orderModel.js
const db = require('./db');

const createOrder = async (user_id, items) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *',
      [user_id, 'pending']
    );
    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)',
        [order.id, item.product_id, item.quantity]
      );
    }

    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getAllOrders = async () => {
  const result = await db.query(
    `SELECT o.*, u.email AS user_email
     FROM orders o
     JOIN users u ON o.user_id = u.id
     ORDER BY o.created_at DESC`
  );
  return result.rows;
};

const getOrderById = async (id) => {
  const orderResult = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
  const itemsResult = await db.query(
    `SELECT oi.*, p.name AS product_name
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [id]
  );

  return {
    ...orderResult.rows[0],
    items: itemsResult.rows,
  };
};

const deleteOrder = async (id) => {
  await db.query('DELETE FROM order_items WHERE order_id = $1', [id]);
  const result = await db.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
};
