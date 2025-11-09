import express from 'express';
import { userController } from '../controllers/UserController.js';

export const router = express.Router();

router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

router.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});