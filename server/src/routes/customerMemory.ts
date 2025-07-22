import express from 'express';
import { PrismaClient } from '../../generated/prisma';
import { authMiddleware, AuthRequest } from '../middleware';

export const customerMemoryRouter = express.Router();
const prisma = new PrismaClient();

customerMemoryRouter.get('/test', (req, res) => {
    console.log('Customer memory test route hit');
    res.json({ message: 'Customer memory router is working' });
});

customerMemoryRouter.put('/:customerId', authMiddleware, async (req: AuthRequest, res) => {
    const userId = req.userId;
    const customerId = req.params.customerId;
    const { preferences, objections, buyingSignals, confidence } = req.body;
    
    console.log('Customer Memory Update Request:');
    console.log('- Customer ID:', customerId);
    console.log('- User ID:', userId);
    console.log('- Request body:', req.body);
    
    if (!userId) {
        return res.status(403).json({ message: "User not authenticated" });
    }
    
    try {
        
        const customer = await prisma.customer.findUnique({
            where: { id: customerId },
        });
        
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        
        if (customer.createdById !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this customer memory' });
        }
        
        console.log('Upserting customer memory...');
        
        // Upsert customer memory (create if doesn't exist, update if exists)
        const customerMemory = await prisma.customerMemory.upsert({
            where: { customerId: customerId },
            update: {
                preferences: preferences || null,
                objections: objections || null,
                buyingSignals: buyingSignals || null,
                confidence: confidence || 1.0,
                updatedAt: new Date(),
            },
            create: {
                customerId: customerId,
                preferences: preferences || null,
                objections: objections || null,
                buyingSignals: buyingSignals || null,
                confidence: confidence || 1.0,
            },
        });
        
        console.log('Customer memory upserted successfully:', customerMemory);
        return res.json(customerMemory);
    } catch (error) {
        console.error("Error updating customer memory:", error);
        return res.status(500).json({ message: 'Error updating customer memory' });
    }
});
