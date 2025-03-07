import Bull from 'bull';
import prisma_client from '../config/prisma_client';
import { ReportRequestStatus } from '../types/ReportRequest';

class UserMailerWorker {
  static async report_ready_notification(job: Bull.Job) {
    const { user_id, report_request_id } = job.data;

    const user = await prisma_client.user.findUnique({ where: { id: user_id } });
    if (!user) { throw new Error(`User with id ${user_id} not found`); }

    const report_request = await prisma_client.reportRequest.findUnique({ where: { id: report_request_id, user_id: user_id } });
    if (!report_request) { throw new Error(`Report request with id ${report_request_id} not found`); }
    if (report_request.status !== ReportRequestStatus.PROCESSED) { throw new Error(`Report request with id ${report_request_id} is not processed`); }

    const report = await prisma_client.report.findUnique({ where: { report_request_id: report_request_id } });

    if (!report) { throw new Error(`Report with id ${report_request_id} not found`); }

    const report_url = `${process.env.FRONTEND_URL}/reports/${report_request_id}`;
    console.log(`Sending report ready notification to ${user.email}, report url: ${report_url}`);
  }
}

export default UserMailerWorker;