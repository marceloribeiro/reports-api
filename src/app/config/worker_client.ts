import Bull from 'bull';

const bull_client = new Bull('default', {
  redis: {
    host: 'localhost',
    port: 6379
  }
});

export default bull_client;