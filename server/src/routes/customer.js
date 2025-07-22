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
exports.customerRouter = void 0;
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../generated/prisma");
const middleware_1 = require("../middleware");
exports.customerRouter = express_1.default.Router();
const prisma = new prisma_1.PrismaClient();
exports.customerRouter.post('/', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const userId = req.userId;
    if (!userId) {
        return res.status(403).json({ message: "User not authenticated" });
    }
    try {
        const customer = yield prisma.customer.create({
            data: {
                name: body.name,
                company: body.company,
                email: body.email,
                phone: body.phone,
                createdById: userId,
            },
        });
        return res.status(201).json(customer);
    }
    catch (error) {
        console.error("Error creating customer:", error);
        return res.status(500).json({ message: 'Error creating customer' });
    }
}));
exports.customerRouter.get('/', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        return res.status(403).json({ message: "User not authenticated" });
    }
    try {
        const customers = yield prisma.customer.findMany({
            where: { createdById: userId, deleted: false },
            select: {
                id: true,
                name: true,
                email: true,
                company: true,
            },
        });
        return res.json(customers);
    }
    catch (error) {
        console.error("Error fetching customers:", error);
        return res.status(500).json({ message: 'Error fetching customers' });
    }
}));
exports.customerRouter.get('/:id', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const customerId = req.params.id;
    if (!userId) {
        return res.status(403).json({ message: "User not authenticated" });
    }
    try {
        const customer = yield prisma.customer.findFirst({
            where: { id: customerId, createdById: userId, deleted: false },
            include: {
                deals: true,
                interactions: true,
                memory: true,
            },
        });
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        return res.json(customer);
    }
    catch (error) {
        console.error("Error fetching customer:", error);
        return res.status(500).json({ message: 'Error fetching customer' });
    }
}));
