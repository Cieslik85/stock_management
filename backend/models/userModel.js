const db = require('./db');

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

module.exports = {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
};
