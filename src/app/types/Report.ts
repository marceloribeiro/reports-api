interface IReport {
  id: string
  title: string
  description: string
  result: string
  report_request_id: string
  user_id: string
  created_at: Date
  updated_at: Date
}

export { IReport }
