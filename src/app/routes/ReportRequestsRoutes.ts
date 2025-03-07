import { Router } from 'express';
import reportRequestsController from '../controllers/ReportRequestsController';
import AuthenticatedUser from '../middleware/AuthenticatedUser';

const router = Router();
router.use(AuthenticatedUser);

router.get('/', reportRequestsController.index);
router.post('/', reportRequestsController.create);
router.get('/:id', reportRequestsController.show);
router.put('/:id', reportRequestsController.update);
router.delete('/:id', reportRequestsController.destroy);
router.patch('/:id/cancel', reportRequestsController.cancel);
router.patch('/:id/resume', reportRequestsController.resume);

export default router;