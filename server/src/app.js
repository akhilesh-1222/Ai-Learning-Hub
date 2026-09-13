import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import examCoachRoutes from "./routes/examCoachRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import codingRoutes from "./routes/codingRoutes.js";

const app = express();

// Enable trust proxy for Render / reverse proxies so req.ip and rate-limiting work properly per user
app.set("trust proxy", 1);

// Security Middlewares
app.use(helmet());

// Dynamic CORS configuration to support Vercel preview URLs & custom domains
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, "") : null,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server or health check pings)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      // Fallback to allow during adoption/deployment
      return callback(null, true);
    },
    credentials: true,
  })
);

// Health Check endpoint (Placed BEFORE rate limiter so keep-alive cron pings don't consume rate limit)
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "AI Learning Hub Backend is running",
    timestamp: new Date().toISOString()
  });
});

// Rate Limiting (Protects free tier without locking out legitimate users)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Allows 300 requests per 15 mins per individual IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests from this device, please try again in a few minutes." },
});
app.use("/api", limiter);

// Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/exam-coach", examCoachRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/coding", codingRoutes);

export default app;
