import express from 'express';
import { getAllUsers, deleteUser, getUserById, updateUser } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, getAllUsers);
router.delete('/:id', authMiddleware, deleteUser);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUser);

export default router;