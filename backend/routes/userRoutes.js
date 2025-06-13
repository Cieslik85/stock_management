const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

// Basic user management (admin only ideally)
router.get('/', verifyToken, UserController.getAll);
router.get('/:id', verifyToken, UserController.getById);
router.delete('/:id', verifyToken, UserController.delete);
router.patch('/:id/role', verifyToken, UserController.updateRole);

module.exports = router;
