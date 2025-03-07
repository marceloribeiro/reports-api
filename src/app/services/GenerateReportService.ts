import prisma_client from "../config/prisma_client";
import worker_client from "../config/worker_client";
import { IReport } from "../types/Report";
import { ReportRequestStatus } from "../types/ReportRequest";

class GenerateReportService {
  async generateReport(report_request_id: string): Promise<IReport> {
    const report_request = await prisma_client.reportRequest.findUnique({ where: { id: report_request_id } });

    if (!report_request) {
      throw new Error('Report request not found');
    }

    if (report_request.status !== ReportRequestStatus.PENDING) {
      throw new Error('Report request is not pending');
    }

    await prisma_client.reportRequest.update({
      where: { id: report_request_id },
      data: { status: ReportRequestStatus.PROCESSING, updated_at: new Date() },
    });

    try {
      const report = await prisma_client.report.create({
        data: {
          report_request_id: report_request.id,
          user_id: report_request.user_id,
          title: 'Report generated at ' + new Date().toISOString(),
          description: 'Description for report generated at ' + new Date().toISOString(),
          result: 'Result for report generated at ' + new Date().toISOString(),
          created_at: new Date(),
          updated_at: new Date(),
        }
      });

      await prisma_client.reportRequest.update({
        where: { id: report_request_id },
        data: { status: ReportRequestStatus.PROCESSED, updated_at: new Date() },
      });

      worker_client.add('UserMailerWorker#report_ready_notification', {
        user_id: report_request.user_id,
        report_request_id: report_request_id
      });

      return report;
    } catch (error) {
      await prisma_client.reportRequest.update({
        where: { id: report_request.id },
        data: { status: ReportRequestStatus.ERROR, updated_at: new Date() }
      });

      throw new Error('Failed to generate report for request ' + report_request_id + ': ' + error);
    }
  }
}

export default GenerateReportService;