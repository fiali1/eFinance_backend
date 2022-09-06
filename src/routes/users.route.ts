import { Router } from 'express';
import {
  addUser,
  checkUsername,
  deleteUser,
  getUserData,
  updateUser,
} from '../controllers/usersController';
import { auth } from '../middlewares/auth';
import { validate } from '../middlewares/validationMiddleware';
import {
  createUserSchema,
  updateUserSchema,
} from '../validations/userValidation';

const usersRoutes = Router();

usersRoutes.post('/users/verify', checkUsername);
usersRoutes.post('/users', validate(createUserSchema), addUser);
usersRoutes.get('/users/:username', auth, getUserData);
usersRoutes.put(
  '/users/:username',
  auth,
  validate(updateUserSchema),
  updateUser
);
usersRoutes.delete('/users/:username', auth, deleteUser);

export { usersRoutes };
