import { IUser } from '../types/User';

class UserPresenter {
  static present(user: IUser) {
    return {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at
    }
  }
}

export default UserPresenter;