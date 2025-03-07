import Bull from 'bull';

const worker_client = new Bull('default', {
  redis: {
    host: 'localhost',
    port: 6379
  }
});

export default worker_client;