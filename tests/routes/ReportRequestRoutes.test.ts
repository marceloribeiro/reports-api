import request from 'supertest';
import prisma_client from '../../src/app/config/prisma_client';
import AuthService from '../../src/app/services/AuthService';
import { User, ReportRequest } from '@prisma/client';
import server from '../../src/web_server';
import { ReportRequestStatus } from '../../src/app/types/ReportRequest';

describe('Report Requests Routes', () => {
  let testUser: User;
  let authToken: string;
  let testReportRequest: ReportRequest;
  const testPassword = 'password123';
  const testEmail = 'test@example.com';

  beforeAll(async () => {
    await prisma_client.user.deleteMany({ where: { email: testEmail } });
    testUser = await AuthService.registerUser(testEmail, testPassword);

    const loginResponse = await request(server)
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });
    authToken = loginResponse.body.token;
  });

  afterAll(async () => {
    await prisma_client.reportRequest.deleteMany({ where: { user_id: testUser.id } });
    await prisma_client.user.deleteMany({ where: { email: testEmail } });
    await prisma_client.$disconnect();
  });

  describe('Authentication', () => {
    it('should reject requests without authentication', async () => {
      const response = await request(server).get('/report_requests');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /report_requests', () => {
    beforeEach(async () => {
      await prisma_client.reportRequest.deleteMany({ where: { user_id: testUser.id } });
      testReportRequest = await prisma_client.reportRequest.create({
        data: {
          user_id: testUser.id,
          status: ReportRequestStatus.PENDING,
          scheduled_at: new Date()
        }
      });
    });

    it('should list all report requests for authenticated user', async () => {
      const response = await request(server)
        .get('/report_requests')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('report_requests');
      expect(Array.isArray(response.body.report_requests)).toBe(true);
      expect(response.body.report_requests.length).toBeGreaterThan(0);
    });
  });

  describe('POST /report_requests', () => {
    it('should create a new report request', async () => {
      const scheduled_at = new Date(Date.now() + 86400000); // Tomorrow
      const response = await request(server)
        .post('/report_requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ scheduled_at });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('report_request');
      expect(response.body.report_request.status).toBe(ReportRequestStatus.PENDING);
      expect(new Date(response.body.report_request.scheduled_at)).toEqual(scheduled_at);
    });

    it('should create with immediate schedule when scheduled_at is in the past', async () => {
      const response = await request(server)
        .post('/report_requests')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ scheduled_at: new Date(Date.now() - 86400000) }); // Yesterday

      expect(response.status).toBe(200);
      expect(response.body.report_request.scheduled_at).toBeDefined();
    });
  });

  describe('GET /report_requests/:id', () => {
    it('should return a specific report request', async () => {
      const response = await request(server)
        .get(`/report_requests/${testReportRequest.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('report_request');
      expect(response.body.report_request.id).toBe(testReportRequest.id);
    });

    it('should return 404 for non-existent report request', async () => {
      const response = await request(server)
        .get('/report_requests/nonexistent-id')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /report_requests/:id', () => {
    it('should update report request scheduled_at', async () => {
      const newScheduledAt = new Date(Date.now() + 172800000); // 2 days from now
      const response = await request(server)
        .put(`/report_requests/${testReportRequest.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ scheduled_at: newScheduledAt });

      expect(response.status).toBe(200);
      expect(response.body.report_request.scheduled_at).toBeDefined();
      expect(new Date(response.body.report_request.scheduled_at)).toEqual(newScheduledAt);
    });
  });

  describe('DELETE /report_requests/:id', () => {
    it('should delete a report request', async () => {
      const response = await request(server)
        .delete(`/report_requests/${testReportRequest.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Report request deleted');

      // Verify deletion
      const verifyResponse = await request(server)
        .get(`/report_requests/${testReportRequest.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(verifyResponse.status).toBe(404);
    });
  });

  describe('PATCH /report_requests/:id/cancel', () => {
    beforeEach(async () => {
      testReportRequest = await prisma_client.reportRequest.create({
        data: {
          user_id: testUser.id,
          status: ReportRequestStatus.PENDING,
          scheduled_at: new Date()
        }
      });
    });

    it('should cancel a pending report request', async () => {
      const response = await request(server)
        .patch(`/report_requests/${testReportRequest.id}/cancel`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.report_request.status).toBe(ReportRequestStatus.CANCELED);
    });

    it('should fail to cancel a non-pending report request', async () => {
      // First cancel the request
      await request(server)
        .patch(`/report_requests/${testReportRequest.id}/cancel`)
        .set('Authorization', `Bearer ${authToken}`);

      // Try to cancel again
      const response = await request(server)
        .patch(`/report_requests/${testReportRequest.id}/cancel`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Report request is not pending');
    });
  });

  describe('PATCH /report_requests/:id/resume', () => {
    beforeEach(async () => {
      testReportRequest = await prisma_client.reportRequest.create({
        data: {
          user_id: testUser.id,
          status: ReportRequestStatus.CANCELED,
          scheduled_at: new Date()
        }
      });
    });

    it('should resume a canceled report request', async () => {
      const response = await request(server)
        .patch(`/report_requests/${testReportRequest.id}/resume`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.report_request.status).toBe(ReportRequestStatus.PENDING);
    });

    it('should fail to resume a non-canceled report request', async () => {
      // First resume the request
      await request(server)
        .patch(`/report_requests/${testReportRequest.id}/resume`)
        .set('Authorization', `Bearer ${authToken}`);

      // Try to resume again
      const response = await request(server)
        .patch(`/report_requests/${testReportRequest.id}/resume`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Report request is not canceled');
    });
  });
});
