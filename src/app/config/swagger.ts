import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Emobi Reports API',
      version: process.env.CURRENT_VERSION,
      description: 'API documentation for Emobi Reports',
    },
    servers: [
      {
        url: 'http://localhost:' + process.env.PORT,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./src/app/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options as any);