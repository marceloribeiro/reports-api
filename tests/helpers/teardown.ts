import worker_client from '../../src/app/config/worker_client';

afterAll(async () => {
  await worker_client.close();
});