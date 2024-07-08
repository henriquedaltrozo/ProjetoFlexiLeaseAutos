import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import connectToDatabase from './database/conn';
import { errors } from 'celebrate';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', routes);
app.use(errors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  connectToDatabase();
  console.log(`App running on port ${port}`);
});

export { app, server };
