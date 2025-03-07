import request from 'supertest';
import prisma_client from '../../src/app/config/prisma_client';
import AuthService from '../../src/app/services/AuthService';
import { User } from '@prisma/client';
import server from '../../src/web_server';

describe('Auth Routes', () => {
  let testUser: User;
  const testPassword = 'password123';
  const testEmail = 'test@example.com';

  beforeAll(async () => {
    await prisma_client.user.deleteMany({ where: { email: testEmail } });
    testUser = await AuthService.registerUser(testEmail, testPassword);
  });

  afterAll(async () => {
    await prisma_client.user.deleteMany({ where: { email: testEmail } });
    await prisma_client.$disconnect();
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({ email: testEmail, password: testPassword });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testEmail);
    });

    it('should fail with invalid password', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({ email: testEmail, password: 'wrongpassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should fail with non-existent email', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({ email: 'nonexistent@example.com', password: testPassword });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('POST /auth/register', () => {
    const newEmail = 'newuser@example.com';

    afterEach(async () => {
      await prisma_client.user.deleteMany({ where: { email: newEmail } });
    });

    it('should register a new user successfully', async () => {
      const response = await request(server)
        .post('/auth/register')
        .send({ email: newEmail, password: 'newpassword123' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(newEmail);
    });

    it('should fail when registering with existing email', async () => {
      const response = await request(server)
        .post('/auth/register')
        .send({ email: testEmail, password: 'newpassword123' });

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Protected Routes', () => {
    let authToken: string;

    beforeEach(async () => {
      const loginResponse = await request(server)
        .post('/auth/login')
        .send({ email: testEmail, password: testPassword });
      authToken = loginResponse.body.token;
    });

    describe('POST /logout', () => {
      it('should logout successfully with valid token', async () => {
        const response = await request(server)
          .post('/auth/logout')
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logged out');
      });

      it('should fail without auth token', async () => {
        const response = await request(server)
          .post('/auth/logout');

        expect(response.status).toBe(401);
      });
    });

    describe('GET /me', () => {
      it('should return user info with valid token', async () => {
        const response = await request(server)
          .get('/auth/me')
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe(testEmail);
      });

      it('should fail without auth token', async () => {
        const response = await request(server)
          .get('/auth/me');

        expect(response.status).toBe(401);
      });
    });
  });
});
