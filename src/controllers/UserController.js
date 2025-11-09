import { userService } from "../services/userService.js";

const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    if (error.message === 'Invalid user ID') {
      return res.status(400).json({ message: 'Invalid userId (not uuid)' });
    }
    throw error;
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    if (error.message.includes('required fields')) {
      return res.status(400).json({ message: 'Request body does not contain required fields' });
    }
    throw error;
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    if (error.message === 'Invalid user ID') {
      return res.status(400).json({ message: 'Invalid userId (not uuid)' });
    }
    throw error;
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Invalid user ID') {
      return res.status(400).json({ message: 'Invalid userId (not uuid)' });
    }
    throw error;
  }
};

export const userController = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};