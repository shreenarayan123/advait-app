import express from "express";
import { PrismaClient } from "../../generated/prisma";
import { authMiddleware, AuthRequest } from "../middleware";

export const customerRouter = express.Router();
const prisma = new PrismaClient();

customerRouter.post("/", authMiddleware, async (req: AuthRequest, res) => {
  const body = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  try {
    const customer = await prisma.customer.create({
      data: {
        name: body.name,
        company: body.company,
        email: body.email,
        phone: body.phone,
        createdById: userId,
      },
    });
    return res.status(201).json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    return res.status(500).json({ message: "Error creating customer" });
  }
});

customerRouter.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(403).json({ message: "User not authenticated" });
  }
  try {
    const customers = await prisma.customer.findMany({
      where: { createdById: userId, deleted: false },
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
      },
    });
    return res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({ message: "Error fetching customers" });
  }
});

customerRouter.get("/:id", authMiddleware, async (req: AuthRequest, res) => {
  const userId = req.userId;
  const customerId = req.params.id;
  if (!userId) {
    return res.status(403).json({ message: "User not authenticated" });
  }
  try {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, createdById: userId, deleted: false },
      include: {
        deals: true,
        interactions: true,
        memory: true,
      },
    });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    return res.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return res.status(500).json({ message: "Error fetching customer" });
  }
});
