const db = require('./db');

const create = async (movement) => {
  const { product_id, movement_type, quantity, note } = movement;
  const result = await db.query(
    `INSERT INTO stock_movements (product_id, movement_type, quantity, note)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [product_id, movement_type, quantity, note]
  );
  return result.rows[0];
};

const getAll = async () => {
  const result = await db.query(`
    SELECT sm.*, p.name AS product_name
    FROM stock_movements sm
    JOIN products p ON sm.product_id = p.id
    ORDER BY sm.created_at DESC
  `);
  return result.rows;
};

const getByProductId = async (productId) => {
  const result = await db.query(
    `SELECT * FROM stock_movements WHERE product_id = $1 ORDER BY created_at DESC`,
    [productId]
  );
  return result.rows;
};

module.exports = {
  create,
  getAll,
  getByProductId
};
