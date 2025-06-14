const pool = require('./db');

// Fetch stock entries where quantity is below a given threshold (default: 5)
const getLowStockItems = async (threshold = 5) => {
  const result = await pool.query(
    `SELECT s.*, p.name AS product_name
     FROM stock s
     JOIN products p ON s.product_id = p.id
     WHERE s.quantity < $1`,
    [threshold]
  );
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

module.exports = {
  getLowStockItems,
  getStockSummary
};
