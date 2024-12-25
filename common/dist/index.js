"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookingRequestInput = exports.bookingRequestInput = exports.signinInput = exports.signUpInput = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signUpInput = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6)
});
exports.signinInput = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6)
});
exports.bookingRequestInput = zod_1.default.object({
    vehicle: zod_1.default.string(),
    dateTime: zod_1.default.string().datetime(),
    firstName: zod_1.default.string(),
    LastName: zod_1.default.string(),
    email: zod_1.default.string().email(),
    phone: zod_1.default.string(),
    note: zod_1.default.string()
});
exports.updateBookingRequestInput = zod_1.default.object({
    vehicle: zod_1.default.string(),
    dateTime: zod_1.default.string().datetime(),
    firstName: zod_1.default.string(),
    LastName: zod_1.default.string(),
    email: zod_1.default.string().email(),
    phone: zod_1.default.string(),
    note: zod_1.default.string()
});
