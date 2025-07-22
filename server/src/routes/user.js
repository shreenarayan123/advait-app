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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../../generated/prisma");
exports.userRouter = express_1.default.Router();
const prisma = new prisma_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
exports.userRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const existingUser = yield prisma.user.findFirst({
        where: {
            email: body.username,
            password: body.password,
        },
    });
    if (existingUser) {
        return res.status(403).json({ message: 'Email or username already taken' });
    }
    try {
        const user = yield prisma.user.create({
            data: {
                email: body.username,
                password: body.password,
            },
        });
        console.log('User created:', user);
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET);
        return res.json({ token: token, user }).status(201);
    }
    catch (error) {
        console.log('Error while signing up:', error);
        return res.status(403).json({ message: 'Error while signing up' });
    }
}));
exports.userRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const user = yield prisma.user.findFirst({
            where: {
                email: body.username,
                password: body.password,
            },
        });
        if (!user) {
            return res.status(403).json({ message: 'User does not exist' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET);
        return res.json({ token: token, user });
    }
    catch (error) {
        return res.status(411).json({ message: 'Error while signing in' });
    }
}));
