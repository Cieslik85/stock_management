const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');
const permit = require('../middleware/roleMiddleware');

// Basic user management (admin only ideally)
router.get('/', verifyToken, UserController.getAll);
router.get('/:id', verifyToken, UserController.getById);
router.delete('/:id', verifyToken, permit('admin'), UserController.delete);
router.patch('/:id/role', verifyToken, permit('admin'), UserController.updateRole);
router.post('/', verifyToken, permit('admin'), UserController.createUser);

module.exports = router;
