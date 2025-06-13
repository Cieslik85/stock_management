const pool = require('./db');

const create = async (product_id, quantity) => {
  const result = await pool.query(
    'INSERT INTO stock (product_id, quantity) VALUES ($1, $2) RETURNING *',
    [product_id, quantity]
  );
  return result.rows[0];
};

const getAll = async () => {
  const result = await pool.query(
    'SELECT s.*, p.name AS product_name FROM stock s JOIN products p ON s.product_id = p.id'
  );
  return result.rows;
};

const getById = async (id) => {
  const result = await pool.query('SELECT * FROM stock WHERE id = $1', [id]);
  return result.rows[0];
};

const update = async (id, quantity) => {
  const result = await pool.query(
    'UPDATE stock SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [quantity, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query('DELETE FROM stock WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove
};
