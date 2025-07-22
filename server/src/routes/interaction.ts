import express from 'express';
import { PrismaClient } from '../../generated/prisma';
import { authMiddleware, AuthRequest } from '../middleware';

export const interactionRouter = express.Router();
const prisma = new PrismaClient();

interactionRouter.post('/', authMiddleware, async (req: AuthRequest, res) => {
    const userId = req.userId;
    const { type, content, customerId } = req.body;
    if (!userId) {
        return res.status(403).json({ message: "User not authenticated" });
    }
    try {
        const interaction = await prisma.interaction.create({
            data: {
                type,
                content,
                customerId,
                createdById: userId,
            },
        });
        return res.status(201).json(interaction);
    } catch (error) {
        console.error("Error creating interaction:", error);
        return res.status(500).json({ message: 'Error creating interaction' });
    }
}); 

interactionRouter.get('/', authMiddleware, async (req: AuthRequest, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    try {
        const interactions = await prisma.interaction.findMany({
            where: {
                createdById: userId,
            },
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        company: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.json(interactions);
    } catch (error) {
        console.error("Error fetching interactions:", error);
        return res.status(500).json({ message: 'Error fetching interactions' });
    }
});
