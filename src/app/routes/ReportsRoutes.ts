import { Router } from "express";
import reportsController from "../controllers/ReportsController";
import AuthenticatedUser from "../middleware/AuthenticatedUser";

const router = Router();
router.use(AuthenticatedUser);

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: List reports
 *     description: Get all reports for the authenticated user
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reports:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/', reportsController.index);

/**
 * @swagger
 * /reports/{id}:
 *   get:
 *     summary: Get report
 *     description: Get a specific report by ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report not found
 */
router.get('/:id', reportsController.show);

export default router;