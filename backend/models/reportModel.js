
const pool = require('./db');

// Fetch stock entries where quantity is below a given threshold (default: 5)
const getLowStockItems = async (threshold = 5, startDate = null, endDate = null) => {

  let query = `
    SELECT s.id, p.name AS product_name, s.quantity, s.updated_at
    FROM stock s
    JOIN products p ON s.product_id = p.id
    WHERE s.quantity < $1
  `;
  const values = [threshold];

  if (startDate) {
    values.push(startDate);
    query += ` AND s.updated_at >= $${values.length}`;
  }

  if (endDate) {
    values.push(endDate);
    query += ` AND s.updated_at <= $${values.length}`;
  }

  query += ` ORDER BY s.updated_at DESC`;

  const result = await pool.query(query, values);

  return result.rows;
};

// Return a summary of total quantity per product
const getStockSummary = async () => {
  const result = await pool.query(
    `SELECT p.name AS product_name, SUM(s.quantity) AS total_quantity
     FROM stock s
     JOIN products p ON s.product_id = p.id
     GROUP BY p.name
     ORDER BY total_quantity DESC`
  );
  return result.rows;
};

// Filtered stock report
const getFilteredStock = async ({ product_id, min_quantity }) => {
  let query = `
    SELECT s.*, p.name AS product_name
    FROM stock s
    JOIN products p ON s.product_id = p.id
    WHERE 1=1
  `;
  const params = [];

  if (product_id) {
    params.push(product_id);
    query += ` AND s.product_id = $${params.length}`;
  }

  if (min_quantity) {
    params.push(min_quantity);
    query += ` AND s.quantity >= $${params.length}`;
  }

  const result = await pool.query(query, params);
  return result.rows;
};



module.exports = {
  getLowStockItems,
  getStockSummary,
  getFilteredStock
};
