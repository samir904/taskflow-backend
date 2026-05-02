import asyncHandler from "express-async-handler";
import Project from "../MODELS/Project.js";  // ← UPPERCASE
import User from "../MODELS/User.js";        // ← UPPERCASE
// @desc    Create a project
// @route   POST /api/projects
// @access  Admin
const createProject = asyncHandler(async (req, res) => {
  console.log("BODY:", req.body);
  console.log("USER:", req.user);

  const { title, description } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Project title is required");
  }

  const project = await Project.create({
    title,
    description,
    createdBy: req.user._id,
    members: [req.user._id], // creator is auto-added
  });

  res.status(201).json({ success: true, project });
});

// @desc    Get all projects (Admin sees all, Member sees assigned)
// @route   GET /api/projects
// @access  Private
const getAllProjects = asyncHandler(async (req, res) => {
  let projects;

  if (req.user.role === "Admin") {
    projects = await Project.find()
      .populate("createdBy", "name email")
      .populate("members", "name email role");
  } else {
    projects = await Project.find({ members: req.user._id })
      .populate("createdBy", "name email")
      .populate("members", "name email role");
  }

  res.status(200).json({ success: true, count: projects.length, projects });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("createdBy", "name email")
    .populate("members", "name email role");

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Members can only view their own projects
  if (
    req.user.role === "Member" &&
    !project.members.some((m) => m._id.toString() === req.user._id.toString())
  ) {
    res.status(403);
    throw new Error("Not authorized to view this project");
  }

  res.status(200).json({ success: true, project });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Admin
const updateProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  project.title = title || project.title;
  project.description = description || project.description;
  await project.save();

  res.status(200).json({ success: true, project });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Admin
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  await project.deleteOne();

  res.status(200).json({ success: true, message: "Project deleted" });
});

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Admin
const addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (project.members.includes(userId)) {
    res.status(400);
    throw new Error("User is already a member of this project");
  }

  project.members.push(userId);
  await project.save();

  res.status(200).json({ success: true, message: "Member added", project });
});

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Admin
const removeMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  project.members = project.members.filter(
    (m) => m.toString() !== req.params.userId
  );

  await project.save();

  res.status(200).json({ success: true, message: "Member removed", project });
});

export {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
};