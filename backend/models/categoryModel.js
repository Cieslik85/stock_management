const db = require('./db');

const getAllCategories = async () => {
  const result = await db.query('SELECT * FROM categories ORDER BY id');
  return result.rows;
};

const getCategoryById = async (id) => {
  const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
  return result.rows[0];
};

const createCategory = async (name, description) => {
  const result = await db.query(
    'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return result.rows[0];
};

const updateCategory = async (id, name) => {
  const result = await db.query(
    'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
    [name, id]
  );
  return result.rows[0];
};

const deleteCategory = async (id) => {
  await db.query('DELETE FROM categories WHERE id = $1', [id]);
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
