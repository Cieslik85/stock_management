const db = require('./db');
const bcrypt = require('bcryptjs');

const getAllUsers = async () => {
  const result = await db.query('SELECT id, email, username, role FROM users ORDER BY id');
  return result.rows;
};

const getUserById = async (id) => {
  const result = await db.query('SELECT id, email, username, role FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const deleteUser = async (id) => {
  await db.query('DELETE FROM users WHERE id = $1', [id]);
};

const updateUserRole = async (id, role) => {
  const result = await db.query(
    'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, email, username, role',
    [role, id]
  );
  return result.rows[0];
};

const create = async ({ username, email, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.query(
    'INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
    [username, email, hashedPassword, role]
  );

  return result.rows[0];
};

const update = async (id, username, email, role) => {
  const result = await db.query(
    `UPDATE users 
     SET username = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP 
     WHERE id = $4 RETURNING id, username, email, role`,
    [username, email, role, id]
  );
  return result.rows[0];
};

const findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0]; // returns user object or undefined
};

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
  create,
  findByEmail,
  update,
};
