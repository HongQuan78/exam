import express from 'express';
import bodyParser from 'body-parser';
import apiRoutes from './routes/api';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import cors from 'cors';

const app = express();
const port = 6000;

const corsOptions = {
  origin: ['https://crud.live', 'https://admin.crud.live', 'http://localhost:3000'], // Specify the allowed origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow all common HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers, e.g., Content-Type, Authorization
};

app.use(cors(corsOptions)); // Apply CORS middleware

app.use(cors(corsOptions)); // Apply CORS middleware

// Swagger set up
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'This is a sample server for my API.',
    },
    servers: [
      {
        url: `http://103.216.118.120:${port}`,
      },
    ],
  },
  apis: ['/routes/*.ts', '/routes/*.js'], // Path to the API docs, including both TS and JS files
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://103.216.118.120:${port}`);
});
