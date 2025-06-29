const db = require('./db');

const create = async (product) => {
  const { name, sku, description, price, category_id } = product;
  const result = await db.query(
    `INSERT INTO products (name, sku, description, price, category_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, sku, description, price, category_id]
  );
  return result.rows[0];
};

const getAll = async () => {
  const result = await db.query('SELECT * FROM products');
  return result.rows;
};

const getById = async (id) => {
  const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
};

const update = async (id, product) => {
  const { name, sku, description, price, category_id } = product;
  const result = await db.query(
    `UPDATE products SET name=$1, sku=$2, description=$3, price=$4, category_id=$5
     WHERE id=$6 RETURNING *`,
    [name, sku, description, price, category_id, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove
};
