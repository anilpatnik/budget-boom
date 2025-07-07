import rateLimit from "express-rate-limit";

export const securityMiddleware = [
  rateLimit({
    windowMs: 30 * 1000 * 1, // 30 sec
    max: 100, // limit each IP to 100 requests per window
    message: "too many requests, please try again after 2 minutes",
    headers: true
  })
];
