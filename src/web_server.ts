import express from 'express';
import routes from './app/routes';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './app/config/swagger';

const server = express();

server.use(cors());
server.use(express.json());
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
server.use('/', routes);

export default server;