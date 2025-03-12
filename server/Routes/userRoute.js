import express from 'express'
import { createUser, deleteUser, getAllUser, getUserById, updateUser,login, logout } from '../Controllers/userController';
export const router = express.Router();
  router.post('/', createUser);
  router.post("/login", login);
  router.post('/logout', logout);

  router.get('/getAllUser', getAllUser); // Get all posts
  router.get('/:id', getUserById); // Get a specific post by ID
  router.put('/:id', updateUser);
  router.delete('/:id', deleteUser);
  export default router;