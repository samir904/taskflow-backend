import express from "express";
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
} from "../CONTROLLERS/project.Controller.js";
import protect from "../MIDDLEWARES/authMiddleware.js";
import { adminOnly } from "../MIDDLEWARES/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, getAllProjects);
router.get("/:id", protect, getProjectById);
router.post("/", protect, adminOnly, createProject);
router.put("/:id", protect, adminOnly, updateProject);
router.delete("/:id", protect, adminOnly, deleteProject);
router.post("/:id/members", protect, adminOnly, addMember);
router.delete("/:id/members/:userId", protect, adminOnly, removeMember);

export default router;