import express from "express";
import { getDashboardStats } from "../CONTROLLERS/dashboard.Controller.js";
import protect from "../MIDDLEWARES/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, getDashboardStats);

export default router;