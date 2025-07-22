
import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma';

export const userRouter = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET as string;


userRouter.post('/signup', async (req, res) => {
  const body = req.body;

  const existingUser = await prisma.user.findFirst({
    where: {
      email: body.username,
      password: body.password,
    },
  });

  if (existingUser) {
    return res.status(403).json({ message: 'Email or username already taken' });
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: body.username,
        password: body.password,
      },
    });

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    return res.json({ jwt: token, user }).status(201);
  } catch (error) {
    return res.status(403).json({ message: 'Error while signing up' });
  }
});

userRouter.post('/signin', async (req, res) => {
  const body = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.username,
        password: body.password,
      },
    });

    if (!user) {
      return res.status(403).json({ message: 'User does not exist' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    return res.json({ jwt: token, user });
  } catch (error) {
    return res.status(411).json({ message: 'Error while signing in' });
  }
});
