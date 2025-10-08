import rateLimit from "express-rate-limit"

export const authLimiter = rateLimit({
    windowMs: 1* 60* 1000,
    max: 6,
    message: { error: "Too many requests, try again later."},
});
