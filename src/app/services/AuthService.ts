import prisma_client from "../config/prisma_client";
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import Jwt from 'jsonwebtoken';
import { IUser } from "../types/User";
import { Prisma } from '@prisma/client';

class AuthService {
  static async authenticateUser(email: string, password: string) {
    const user = await prisma_client.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const authenticated = await bcrypt.compare(password, user.hashed_password);
    return authenticated;
  }

  static async registerUser(email: string, password: string) {
    const hashed_password = await bcrypt.hash(password, 10);
    const salt = Math.floor(Math.random() * 90000000) + 10000000;
    const jti = uuidv4();

    const existingUser = await prisma_client.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('Email already in use.');
    }

    const user = await prisma_client.user.create({
      data: { email, hashed_password, salt, jti }
    });
    return user;
  }

  static async generateJwtToken(user: IUser) {
    const new_jti = uuidv4();
    await prisma_client.user.update({
      where: { id: user.id },
      data: { jti: new_jti }
    });

    const payload = { user_id: user.id, jti: new_jti };
    console.log('payload', payload);

    return Jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  }
}

export default AuthService;