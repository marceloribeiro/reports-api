import { Request, Response } from 'express';
import prisma_client from '../config/prisma_client';
import AuthService from '../services/AuthService';
import { AuthRequest } from '../types/express';
import UserPresenter from '../presenters/UserPresenter';
class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const user = await prisma_client.user.findUnique({
      where: { email: req.body.email }
    });

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return
    }

    const authenticated = await AuthService.authenticateUser(user.email, req.body.password);
    if (!authenticated) {
      res.status(401).json({ message: 'Invalid email or password'});
      return
    }

    res.json({ user: UserPresenter.present(user), token: await AuthService.generateJwtToken(user) });
    return
  }

  async register(req: Request, res: Response): Promise<void> {
    const userData = req.body;
    try {
      const user = await AuthService.registerUser(userData.email, userData.password);
      res.json({
        user: UserPresenter.present(user),
        token: await AuthService.generateJwtToken(user)
      });
    } catch (error: any) {
      res.status(422).json({ error: error.message });
    }
    return
  }

  async logout(req: AuthRequest, res: Response): Promise<void> {
    const user = req.user;
    user.jti = null;
    await prisma_client.user.update({
      where: { id: user.id },
      data: { jti: undefined }
    });
    res.json({ message: 'Logged out' });
    return
  }

  async me(req: AuthRequest, res: Response): Promise<void> {
    res.json({ user: UserPresenter.present(req.user) });
    return
  }
}

export default new AuthController();