"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerMemoryRouter = void 0;
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../generated/prisma");
const middleware_1 = require("../middleware");
exports.customerMemoryRouter = express_1.default.Router();
const prisma = new prisma_1.PrismaClient();
// Update customer memory with AI insights
exports.customerMemoryRouter.put('/:customerId', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const customerId = req.params.customerId;
    const { preferences, objections, buyingSignals, confidence } = req.body;
    if (!userId) {
        return res.status(403).json({ message: "User not authenticated" });
    }
    try {
        // Check if the customer exists and belongs to the user
        const customer = yield prisma.customer.findUnique({
            where: { id: customerId },
        });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        if (customer.createdById !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this customer memory' });
        }
        // Upsert customer memory (create if doesn't exist, update if exists)
        const customerMemory = yield prisma.customerMemory.upsert({
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
        return res.json(customerMemory);
    }
    catch (error) {
        console.error("Error updating customer memory:", error);
        return res.status(500).json({ message: 'Error updating customer memory' });
    }
}));
