export interface IUser {
  id: string
  email: string
  hashed_password?: string
  salt?: number
  jti?: string
  created_at: Date
  updated_at: Date
}