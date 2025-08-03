/**
 * Stock Model
 * Handles all database operations related to stock.
 */

const pool = require('./db');

/**
 * Create a new stock entry for a product.
 * @param {number} product_id - The product's ID.
 * @param {number} quantity - Initial quantity.
 * @returns {Promise<Object>} The created stock row.
 */
const create = async (product_id, quantity) => {
  const result = await pool.query(
    'INSERT INTO stock (product_id, quantity) VALUES ($1, $2) RETURNING *',
    [product_id, quantity]
  );
  return result.rows[0];
};

/**
 * Get all stock entries for non-archived products.
 * Joins with products to include product name, SKU, and archived status.
 * @returns {Promise<Array>} Array of stock rows.
 */
const getAll = async () => {
  const result = await pool.query(
    `SELECT s.*, p.name AS product_name, p.sku, p.archived
     FROM stock s
     JOIN products p ON s.product_id = p.id
     WHERE p.archived = FALSE OR p.archived IS NULL`
  );
  return result.rows;
};

/**
 * Get a stock entry by its ID.
 * @param {number} id - Stock entry ID.
 * @returns {Promise<Object>} The stock row.
 */
const getById = async (id) => {
  const result = await pool.query('SELECT * FROM stock WHERE id = $1', [id]);
  return result.rows[0];
};

/**
 * Update the quantity of a stock entry.
 * @param {number} id - Stock entry ID.
 * @param {number} quantity - New quantity.
 * @returns {Promise<Object>} The updated stock row.
 */
const update = async (id, quantity) => {
  const result = await pool.query(
    'UPDATE stock SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [quantity, id]
  );
  return result.rows[0];
};

/**
 * Increase the quantity of a stock entry.
 * @param {number} id - Stock entry ID.
 * @param {number} amount - Amount to increase.
 * @returns {Promise<Object>} The updated stock row.
 */
const increaseStock = async (id, amount) => {
  const result = await pool.query(
    'UPDATE stock SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [amount, id]
  );
  return result.rows[0];
};

/**
 * Decrease the quantity of a stock entry.
 * @param {number} id - Stock entry ID.
 * @param {number} amount - Amount to decrease.
 * @returns {Promise<Object>} The updated stock row.
 */
const decreaseStock = async (id, amount) => {
  const result = await pool.query(
    'UPDATE stock SET quantity = quantity - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
    [amount, id]
  );
  return result.rows[0];
};

/**
 * Remove a stock entry by its ID.
 * @param {number} id - Stock entry ID.
 * @returns {Promise<Object>} The deleted stock row.
 */
const remove = async (id) => {
  const result = await pool.query('DELETE FROM stock WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  increaseStock,
  decreaseStock,
  remove
};
