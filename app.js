import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { notFound, errorHandler } from "./MIDDLEWARES/errorMiddleware.js";

import authRoutes from "./ROUTES/auth.Routes.js";
import projectRoutes from "./ROUTES/project.Routes.js";
import taskRoutes from "./ROUTES/task.Routes.js";
import dashboardRoutes from "./ROUTES/dashboard.Routes.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://taskflow-frontend-production-1b90.up.railway.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "x-session-id",
      "X-Client-Mode",
      "Authorization",
      "Cache-Control",
    ],
  })
);
app.options("*", cors()); // handle preflight requests
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "health check!",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

// MUST be last
app.use(notFound);
app.use(errorHandler);

export default app;