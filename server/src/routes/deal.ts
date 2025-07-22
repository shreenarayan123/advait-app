import express from 'express';
import { PrismaClient } from '../../generated/prisma';
import { authMiddleware, AuthRequest } from '../middleware';

export const dealRouter = express.Router();
const prisma = new PrismaClient();

dealRouter.post('/', authMiddleware, async (req: AuthRequest, res) => {
    const userId = req.userId;
    const { title, amount, stage, customerId } = req.body;
    if (!userId) {
        return res.status(403).json({ message: "User not authenticated" });
    }
    try {
        const deal = await prisma.deal.create({
            data: {
                title,
                amount,
                stage,
                customerId,
                assignedToId: userId,
            },
        });
        return res.status(201).json(deal);
    } catch (error) {
        console.error("Error creating deal:", error);
        return res.status(500).json({ message: 'Error creating deal' });
    }
});

dealRouter.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
    const userId = req.userId;
    const dealId = req.params.id;
    const { title, amount, stage } = req.body;
    
    if (!userId) {
        return res.status(403).json({ message: "User not authenticated" });
    }
    
    try {
        // Check if the deal exists and belongs to the user
        const existingDeal = await prisma.deal.findUnique({
            where: { id: dealId },
            include: { customer: true }
        });
        
        if (!existingDeal) {
            return res.status(404).json({ message: 'Deal not found' });
        }
        
        // Check if user has access to this deal through customer ownership
        if (existingDeal.customer.createdById !== userId && existingDeal.assignedToId !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this deal' });
        }
        
        const updatedDeal = await prisma.deal.update({
            where: { id: dealId },
            data: {
                ...(title && { title }),
                ...(amount !== undefined && { amount }),
                ...(stage && { stage }),
            },
        });
        
        return res.json(updatedDeal);
    } catch (error) {
        console.error("Error updating deal:", error);
        return res.status(500).json({ message: 'Error updating deal' });
    }
});