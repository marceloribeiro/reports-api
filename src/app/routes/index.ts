import { Router } from 'express';
import mainRoutes from './MainRoutes';
import authRoutes from './AuthRoutes';
import reportRequestsRoutes from './ReportRequestsRoutes';
import reportsRoutes from './ReportsRoutes';

const router = Router();

router.use('/', mainRoutes);
router.use('/auth', authRoutes);
router.use('/report_requests', reportRequestsRoutes);
router.use('/reports', reportsRoutes);

export default router;