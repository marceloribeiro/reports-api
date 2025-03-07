import { Router } from 'express';
import mainRoutes from './MainRoutes';
import authRoutes from './AuthRoutes';
import reportRequestsRoutes from './ReportRequestsRoutes';

const router = Router();

router.use('/', mainRoutes);
router.use('/auth', authRoutes);
router.use('/report_requests', reportRequestsRoutes);

export default router;