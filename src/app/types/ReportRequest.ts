interface IReportRequest {
  id: string
  status: ReportRequestStatus
  scheduled_at: Date
  created_at: Date
  updated_at: Date
}

enum ReportRequestStatus {
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  ERROR = 'ERROR'
}

export { IReportRequest, ReportRequestStatus }