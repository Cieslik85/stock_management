const db = require('./db');
const bcrypt = require('bcryptjs');

const getAllUsers = async () => {
  const result = await db.query('SELECT id, email, role FROM users ORDER BY id');
  return result.rows;
};

const getUserById = async (id) => {
  const result = await db.query('SELECT id, email, role FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const deleteUser = async (id) => {
  await db.query('DELETE FROM users WHERE id = $1', [id]);
};

const updateUserRole = async (id, role) => {
  const result = await db.query(
    'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, role',
    [role, id]
  );
  return result.rows[0];
};

const create = async ({ name, email, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
    [name, email, hashedPassword, role]
  );

  return result.rows[0];
};

const findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0]; // returns user object or undefined
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
  create,
  findByEmail,
};
