import { Request, Response } from 'express';
import prisma_client from '../config/prisma_client';
import { AuthRequest } from '../types/express';
import { ReportRequestStatus } from '../types/ReportRequest';
import worker_client from '../config/worker_client';

class ReportRequestsController {

  async index(req: AuthRequest, res: Response): Promise<void> {
    const reportRequests = await prisma_client.reportRequest.findMany({
      where: { user_id: req.user.id },
      orderBy: {
        scheduled_at: 'asc'
      }
    });
    res.json({ report_requests: reportRequests });
    return;
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    const scheduled_at = req.body.scheduled_at && new Date(req.body.scheduled_at) > new Date() ?
      new Date(req.body.scheduled_at) :
      new Date();

    console.log(`Creating report request with scheduled_at: ${scheduled_at}`);

    const reportRequest = await prisma_client.reportRequest.create({
      data: {
        user_id: req.user.id,
        scheduled_at: scheduled_at,
        status: ReportRequestStatus.PENDING
      }
    });

    if (reportRequest.scheduled_at <= new Date()) {
      worker_client.add('GenerateReportWorker#process', { report_request_id: reportRequest.id });
    }

    res.json({ report_request: reportRequest });
    return;
  }

  async show(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const reportRequest = await prisma_client.reportRequest.findUnique({
      where: { id, user_id: req.user.id }
    });
    if (!reportRequest) {
      res.status(404).json({ message: 'Report request not found' });
      return
    }

    res.json({ report_request: reportRequest });
    return
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const reportRequest = await prisma_client.reportRequest.findUnique({
      where: { id, user_id: req.user.id }
    });

    if (!reportRequest) {
      res.status(404).json({ message: 'Report request not found' });
      return
    }

    const scheduled_at = req.body.scheduled_at ? new Date(req.body.scheduled_at) : reportRequest.scheduled_at;
    const updatedReportRequest = await prisma_client.reportRequest.update({
      where: { id, user_id: req.user.id },
      data: {
        scheduled_at: scheduled_at
      }
    });

    if (scheduled_at <= new Date() && reportRequest.status === ReportRequestStatus.PENDING) {
      worker_client.add('GenerateReportWorker#process', { report_request_id: reportRequest.id });
    }

    res.json({ report_request: updatedReportRequest });
    return
  }

  async destroy(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    await prisma_client.reportRequest.delete({ where: { id, user_id: req.user.id } });
    res.json({ message: 'Report request deleted' });
    return
  }

  async cancel(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const reportRequest = await prisma_client.reportRequest.findUnique({ where: { id, user_id: req.user.id } });
    if (!reportRequest) {
      res.status(404).json({ error: 'Report request not found' });
      return
    }

    if (reportRequest.status !== ReportRequestStatus.PENDING) {
      res.status(400).json({ error: 'Report request is not pending' });
      return
    }

    const updatedReportRequest = await prisma_client.reportRequest.update({
      where: { id, user_id: req.user.id },
      data: { status: ReportRequestStatus.CANCELED }
    });

    res.json({ report_request: updatedReportRequest });
    return
  }

  async resume(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const reportRequest = await prisma_client.reportRequest.findUnique({ where: { id, user_id: req.user.id } });
    if (!reportRequest) {
      res.status(404).json({ error: 'Report request not found' });
      return
    }

    if (reportRequest.status !== ReportRequestStatus.CANCELED) {
      res.status(400).json({ error: 'Report request is not canceled' });
      return
    }

    const updatedReportRequest = await prisma_client.reportRequest.update({
      where: { id, user_id: req.user.id },
      data: { status: ReportRequestStatus.PENDING }
    });

    if (reportRequest.scheduled_at <= new Date()) {
      worker_client.add('GenerateReportWorker#process', { report_request_id: reportRequest.id });
    }

    res.json({ report_request: updatedReportRequest });
    return
  }
}

export default new ReportRequestsController();