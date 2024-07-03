import express from 'express';
import cors from 'cors';
import routes from './routes/index';
import connectToDatabase from './database/conn';
import { errors } from 'celebrate';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', routes);
app.use(errors());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  connectToDatabase();
  console.log(`App running on port ${port}`);
});
