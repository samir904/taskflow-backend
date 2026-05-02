import express from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from "../CONTROLLERS/task.Controller.js";
import protect from "../MIDDLEWARES/authMiddleware.js";
import { adminOnly } from "../MIDDLEWARES/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllTasks);
router.get("/:id", protect, getTaskById);
router.post("/", protect, adminOnly, createTask);
router.put("/:id", protect, adminOnly, updateTask);
router.delete("/:id", protect, adminOnly, deleteTask);

// Members can ONLY update status — separate PATCH route
router.patch("/:id/status", protect, updateTaskStatus);

export default router;