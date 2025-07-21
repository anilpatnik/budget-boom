import rateLimit from "express-rate-limit";

export const securityMiddleware = [
  rateLimit({
    windowMs: 30 * 1000 * 1, // 30 sec
    limit: 100,
    message: "too many requests, please try again after 2 minutes"
  })
];
