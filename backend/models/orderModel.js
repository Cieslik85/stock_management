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
      // Get product price
      const productResult = await client.query(
        'SELECT price FROM products WHERE id = $1',
        [item.product_id]
      );
      const price = productResult.rows[0]?.price;

      if (price == null) {
        throw new Error(`Product with ID ${item.product_id} not found or has no price`);
      }

      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, price]
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
  const ordersResult = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
  const orders = ordersResult.rows;

  for (const order of orders) {
    const itemsResult = await db.query(
      `SELECT oi.*, p.name AS product_name 
       FROM order_items oi 
       JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = $1`,
      [order.id]
    );
    order.items = itemsResult.rows;
  }

  return orders;
};

const getOrderById = async (id) => {
  const orderResult = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
  if (orderResult.rows.length === 0) return null;

  const itemsResult = await db.query(
    `SELECT 
       oi.product_id,
       oi.quantity,
       p.name AS product_name
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
