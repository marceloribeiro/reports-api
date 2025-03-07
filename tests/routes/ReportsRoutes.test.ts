import request from 'supertest';
import prisma_client from '../../src/app/config/prisma_client';
import AuthService from '../../src/app/services/AuthService';
import { User, Report, ReportRequest} from '@prisma/client';
import server from '../../src/web_server';

describe('Reports Routes', () => {
  let testUser: User;
  let authToken: string;
  let testReport: Report;
  let testReportRequest: ReportRequest;
  let otherTestReportRequest: ReportRequest;
  const testPassword = 'password123';
  const testEmail = 'test@example.com';
  const otherEmail = 'other@example.com';

  beforeAll(async () => {
    await prisma_client.user.deleteMany({ where: { email: { in: [testEmail, otherEmail] } } });

    testUser = await AuthService.registerUser(testEmail, testPassword);
    testReportRequest = await prisma_client.reportRequest.create({
      data: {
        user_id: testUser.id,
        scheduled_at: new Date()
      }
    });

    const loginResponse = await request(server)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });
    authToken = loginResponse.body.token;
  });

  beforeEach(async () => {
    testReport = await prisma_client.report.create({
      data: {
        user_id: testUser.id,
        report_request_id: testReportRequest.id,
        title: 'Test Report',
        description: 'Test Description',
        result: 'Test Result'
      }
    });
  });

  afterEach(async () => {
    await prisma_client.report.deleteMany({
      where: { user_id: testUser.id }
    });
  });

  afterAll(async () => {
    await prisma_client.user.deleteMany({ where: { email: testEmail } });
    await prisma_client.$disconnect();
  });

  describe('Authentication', () => {
    it('should reject requests without authentication', async () => {
      const response = await request(server).get('/reports');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /reports', () => {
    it('should list all reports for authenticated user', async () => {
      const response = await request(server)
        .get('/reports')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('reports');
      expect(Array.isArray(response.body.reports)).toBe(true);
      expect(response.body.reports.length).toBeGreaterThan(0);
      expect(response.body.reports[0]).toHaveProperty('id');
      expect(response.body.reports[0].user_id).toBe(testUser.id);
    });

    it('should return empty array when user has no reports', async () => {
      await prisma_client.report.deleteMany({
        where: { user_id: testUser.id }
      });

      const response = await request(server)
        .get('/reports')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('reports');
      expect(Array.isArray(response.body.reports)).toBe(true);
      expect(response.body.reports.length).toBe(0);
    });
  });

  describe('GET /reports/:id', () => {
    it('should return a specific report', async () => {
      const response = await request(server)
        .get(`/reports/${testReport.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('report');
      expect(response.body.report.id).toBe(testReport.id);
      expect(response.body.report.user_id).toBe(testUser.id);
    });

    it('should return 404 for non-existent report', async () => {
      const response = await request(server)
        .get('/reports/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Report not found');
    });

    it('should not return reports belonging to other users', async () => {
      const otherUser = await AuthService.registerUser('other@example.com', 'password123');
      otherTestReportRequest = await prisma_client.reportRequest.create({
        data: {
          user_id: otherUser.id,
          scheduled_at: new Date()
        }
      });

      const otherReport = await prisma_client.report.create({
        data: {
          user_id: otherUser.id,
          report_request_id: otherTestReportRequest.id,
          title: 'Other Report',
          description: 'Other Description',
          result: 'Other Result'
        }
      });

      const response = await request(server)
        .get(`/reports/${otherReport.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Report not found');

      await prisma_client.report.delete({ where: { id: otherReport.id } });
      await prisma_client.user.delete({ where: { id: otherUser.id } });
    });
  });
});
