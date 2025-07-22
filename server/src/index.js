"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_1 = require("./routes/user");
const customer_1 = require("./routes/customer");
const deal_1 = require("./routes/deal");
const interaction_1 = require("./routes/interaction");
const customerMemory_1 = require("./routes/customerMemory");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.API_URL,
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/api/v1/user', user_1.userRouter);
app.use('/api/v1/customers', customer_1.customerRouter);
app.use('/api/v1/deals', deal_1.dealRouter);
app.use('/api/v1/interactions', interaction_1.interactionRouter);
app.use('/api/v1/customer-memory', customerMemory_1.customerMemoryRouter);
app.listen(3000, () => {
    console.log('listening on port 3000');
});
