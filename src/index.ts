import server from './web_server';

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
