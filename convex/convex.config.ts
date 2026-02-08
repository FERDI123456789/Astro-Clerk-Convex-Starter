import { defineApp } from "convex/server";
import rateLimiter from "@convex-dev/rate-limiter/convex.config.js"; // Note: .js extension as per docs

const app = defineApp();
app.use(rateLimiter);

export default app;
