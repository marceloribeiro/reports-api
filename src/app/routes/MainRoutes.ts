import { Router } from 'express';
import mainController from '../controllers/MainController';

const router = Router();

router.get('/', mainController.index);
router.get('/health', mainController.health)

export default router;
