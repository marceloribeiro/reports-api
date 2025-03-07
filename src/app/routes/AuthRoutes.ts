import { Router } from 'express';
import authController from '../controllers/AuthController';
import AuthenticatedUser from '../middleware/AuthenticatedUser';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/logout', AuthenticatedUser, authController.logout);
router.get('/me', AuthenticatedUser, authController.me);

export default router;
