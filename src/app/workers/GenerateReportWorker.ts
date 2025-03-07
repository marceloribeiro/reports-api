import worker_client from "../config/worker_client";
import GenerateReportService from "../services/GenerateReportService";
import Bull from 'bull';

class GenerateReportWorker {
  static async process(job: Bull.Job) {
    const { report_request_id } = job.data;

    console.log('Generating report for request ' + report_request_id);
    const generateReportService = new GenerateReportService();
    await generateReportService.generateReport(report_request_id);
    console.log('Report generated for request ' + report_request_id);

    return;
  }
}

export default GenerateReportWorker;