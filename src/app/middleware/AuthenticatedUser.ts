import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/express';
import Jwt from 'jsonwebtoken';
import prisma_client from '../config/prisma_client';

interface DecodedJwt {
  user_id: string;
  jti: string;
}

export default async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    const decoded = Jwt.verify(token, process.env.JWT_SECRET as string) as DecodedJwt;
    if (decoded) {
      const user_id = decoded.user_id;
      const jti = decoded.jti;
      const user = await prisma_client.user.findUnique({
        where: { id: user_id }
      });

      if (user && user.jti === jti) {
        req.user = user;
      }
    }
  }

  if (req.user) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};