import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

let users = [];

const getAllUsers = async () => users;

const getUserById = async (id) => {
  if (!uuidValidate(id)) throw new Error('Invalid user ID');
  return users.find(u => u.id === id) || null;
};

const createUser = async (data) => {
  const { name, email } = data;
  if (!name || !email) throw new Error('Request body missing required fields');

  const newUser = { id: uuidv4(), name, email, createdAt: new Date() };
  users.push(newUser);
  return newUser;
};

const updateUser = async (id, data) => {
  if (!uuidValidate(id)) throw new Error('Invalid user ID');

  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return null;

  users[idx] = { ...users[idx], ...data, updatedAt: new Date() };
  return users[idx];
};

const deleteUser = async (id) => {
  if (!uuidValidate(id)) throw new Error('Invalid user ID');

  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return false;

  users.splice(idx, 1);
  return true;
};

export const userService = { getAllUsers, getUserById, createUser, updateUser, deleteUser };