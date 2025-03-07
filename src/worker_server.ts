import worker_client from "./app/config/worker_client";
import GenerateReportWorker from "./app/workers/GenerateReportWorker";
import UserMailerWorker from "./app/workers/UserMailerWorker";

worker_client.process('GenerateReportWorker#process', GenerateReportWorker.process);
worker_client.process('UserMailerWorker#report_ready_notification', UserMailerWorker.report_ready_notification);

worker_client.on('failed', (job: any, err: any) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});

console.log('Bull server started. Waiting for jobs');