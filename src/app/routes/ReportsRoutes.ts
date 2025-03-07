import { Router } from "express";
import reportsController from "../controllers/ReportsController";
import AuthenticatedUser from "../middleware/AuthenticatedUser";

const router = Router();
router.use(AuthenticatedUser);

router.get('/', reportsController.index);
router.get('/:id', reportsController.show);

export default router;