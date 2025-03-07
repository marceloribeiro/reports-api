import express from 'express';
import routes from './app/routes';
import cors from 'cors';

const server = express();

server.use(cors());
server.use(express.json());
server.use(routes);

export default server;