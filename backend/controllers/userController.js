const userModel = require('../models/userModel');

exports.getAll = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userModel.deleteUser(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const updated = await userModel.updateUserRole(req.params.id, role);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const newUser = await userModel.create({ username, email, password, role });
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;

  try {
    const updatedUser = await userModel.update(id, username, email, role);
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User updated', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};