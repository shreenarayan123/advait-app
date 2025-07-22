
import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/user';
import { customerRouter } from './routes/customer';
import { dealRouter } from './routes/deal';
import { interactionRouter } from './routes/interaction';
import { customerMemoryRouter } from './routes/customerMemory';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173', // Vite dev server default port
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/customers', customerRouter);
app.use('/api/v1/deals', dealRouter);
app.use('/api/v1/interactions', interactionRouter);
app.use('/api/v1/customer-memory', customerMemoryRouter);

app.listen(3000, () => {
    console.log('listening on port 3000');
});
