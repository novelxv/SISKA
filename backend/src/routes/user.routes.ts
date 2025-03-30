import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authMiddleware, getAllUsers);

router.delete('/:id', authMiddleware, deleteUser);

export default router;