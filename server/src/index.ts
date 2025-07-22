// src/index.ts
import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/user';

const app = express();

app.use(cors()); // ✅ Apply CORS before everything
app.use(express.json());

app.use('/api/user', userRouter);

app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: https://github.com/prisma/prisma-examples/blob/latest/orm/express/README.md#using-the-rest-api`)
);
