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
exports.interactionRouter = void 0;
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../generated/prisma");
const middleware_1 = require("../middleware");
exports.interactionRouter = express_1.default.Router();
const prisma = new prisma_1.PrismaClient();
exports.interactionRouter.post('/', middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { type, content, customerId } = req.body;
    if (!userId) {
        return res.status(403).json({ message: "User not authenticated" });
    }
    try {
        const interaction = yield prisma.interaction.create({
            data: {
                type,
                content,
                customerId,
                createdById: userId,
            },
        });
        return res.status(201).json(interaction);
    }
    catch (error) {
        console.error("Error creating interaction:", error);
        return res.status(500).json({ message: 'Error creating interaction' });
    }
}));
