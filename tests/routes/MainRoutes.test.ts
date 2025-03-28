import request from 'supertest';
import server from '../../src/web_server';

describe('MainRoutes', () => {
  describe('GET /', () => {
    it('should return 200', async () => {
      const response = await request(server).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ api: 'Emobi Reports', version: process.env.CURRENT_VERSION });
    });
  });

  describe('GET /health', () => {
    it('should return 200', async () => {
      const response = await request(server).get('/health');

      expect(response.status).toBe(200);
    });
  });
});