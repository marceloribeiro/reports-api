import { Router } from 'express';
import reportRequestsController from '../controllers/ReportRequestsController';
import AuthenticatedUser from '../middleware/AuthenticatedUser';

const router = Router();
router.use(AuthenticatedUser);

/**
 * @swagger
 * /report_requests:
 *   get:
 *     summary: List report requests
 *     description: Get all report requests for the authenticated user
 *     tags: [Report Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of report requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report_requests:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized
 */
router.get('/', reportRequestsController.index);

/**
 * @swagger
 * /report_requests:
 *   post:
 *     summary: Create report request
 *     description: Create a new report request
 *     tags: [Report Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheduled_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Report request created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report_request:
 *                   type: object
 *       401:
 *         description: Unauthorized
 */
router.post('/', reportRequestsController.create);

/**
 * @swagger
 * /report_requests/{id}:
 *   get:
 *     summary: Get report request
 *     description: Get a specific report request by ID
 *     tags: [Report Requests]
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
 *         description: Report request details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report_request:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report request not found
 */
router.get('/:id', reportRequestsController.show);

/**
 * @swagger
 * /report_requests/{id}:
 *   put:
 *     summary: Update report request
 *     description: Update a specific report request
 *     tags: [Report Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheduled_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Report request updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report_request:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report request not found
 */
router.put('/:id', reportRequestsController.update);

/**
 * @swagger
 * /report_requests/{id}:
 *   delete:
 *     summary: Delete report request
 *     description: Delete a specific report request
 *     tags: [Report Requests]
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
 *         description: Report request deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report request not found
 */
router.delete('/:id', reportRequestsController.destroy);

/**
 * @swagger
 * /report_requests/{id}/cancel:
 *   patch:
 *     summary: Cancel report request
 *     description: Cancel a pending report request
 *     tags: [Report Requests]
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
 *         description: Report request canceled
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report_request:
 *                   type: object
 *       400:
 *         description: Report request is not pending
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report request not found
 */
router.patch('/:id/cancel', reportRequestsController.cancel);

/**
 * @swagger
 * /report_requests/{id}/resume:
 *   patch:
 *     summary: Resume report request
 *     description: Resume a canceled report request
 *     tags: [Report Requests]
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
 *         description: Report request resumed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 report_request:
 *                   type: object
 *       400:
 *         description: Report request is not canceled
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report request not found
 */
router.patch('/:id/resume', reportRequestsController.resume);

export default router;