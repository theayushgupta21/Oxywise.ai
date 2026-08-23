import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 requests per window per IP
    message: { message: "Too many attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});