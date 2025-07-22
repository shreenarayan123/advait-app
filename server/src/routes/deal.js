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
exports.dealRouter = void 0;
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../generated/prisma");
const middleware_1 = require("../middleware");
exports.dealRouter = express_1.default.Router();
const prisma = new prisma_1.PrismaClient();
exports.dealRouter.post('/', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { title, amount, stage, customerId } = req.body;
    if (!userId) {
        return res.status(403).json({ message: "User not authenticated" });
    }
    try {
        const deal = yield prisma.deal.create({
            data: {
                title,
                amount,
                stage,
                customerId,
                assignedToId: userId,
            },
        });
        return res.status(201).json(deal);
    }
    catch (error) {
        console.error("Error creating deal:", error);
        return res.status(500).json({ message: 'Error creating deal' });
    }
}));
exports.dealRouter.put('/:id', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const dealId = req.params.id;
    const { title, amount, stage } = req.body;
    if (!userId) {
        return res.status(403).json({ message: "User not authenticated" });
    }
    try {
        // Check if the deal exists and belongs to the user
        const existingDeal = yield prisma.deal.findUnique({
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
        const updatedDeal = yield prisma.deal.update({
            where: { id: dealId },
            data: Object.assign(Object.assign(Object.assign({}, (title && { title })), (amount !== undefined && { amount })), (stage && { stage })),
        });
        return res.json(updatedDeal);
    }
    catch (error) {
        console.error("Error updating deal:", error);
        return res.status(500).json({ message: 'Error updating deal' });
    }
}));
