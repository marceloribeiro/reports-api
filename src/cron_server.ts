import prisma_client from "./app/config/prisma_client";
import worker_client from "./app/config/worker_client";
import { ReportRequestStatus } from "./app/types/ReportRequest";
import cron from 'node-cron';

// const cron_rule = '*/5 * * * *'; // every 5 minutes
const cron_rule = '* * * * *'; // every minute

const task = cron.schedule(cron_rule, async () => {
  const pending_report_requests = await prisma_client.reportRequest.findMany({
    where: {
      status: ReportRequestStatus.PENDING,
      scheduled_at: { lte: new Date() }
    }
  });

  console.log(`Found ${pending_report_requests.length} pending report requests to process [${new Date().toISOString()}]`);

  for (const report_request of pending_report_requests) {
    worker_client.add('GenerateReportWorker#process', { report_request_id: report_request.id });
  }
});

console.log('Starting cron job to process pending report requests');
task.start();

process.on('SIGTERM', () => {
  task.stop();
  process.exit(0);
});

export default task;