import { Response } from "express";
import { AuthRequest } from "../types/express";
import prisma_client from "../config/prisma_client";

class ReportsController {
  async index(req: AuthRequest, res: Response): Promise<void> {
    const reports = await prisma_client.report.findMany({ where: { user_id: req.user.id } });
    res.json({ reports: reports });
  }

  async show(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params;
    const report = await prisma_client.report.findUnique({ where: { id, user_id: req.user.id } });

    if (!report) {
      res.status(404).json({ error: 'Report not found' });
      return
    }

    res.json({ report: report });
  }
}

export default new ReportsController();
