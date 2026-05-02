import asyncHandler from "express-async-handler";
import Task from "../MODELS/Task.js";
import Project from "../MODELS/Project.js";

// @desc    Create task
// @route   POST /api/tasks
// @access  Admin
const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority, assignedTo, project } =
    req.body;

  if (!title || !dueDate || !project) {
    res.status(400);
    throw new Error("Title, due date and project are required");
  }

  const projectExists = await Project.findById(project);
  if (!projectExists) {
    res.status(404);
    throw new Error("Project not found");
  }

  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    assignedTo: assignedTo || null,
    project,
  });

  await task.populate("assignedTo", "name email");
  await task.populate("project", "title");

  res.status(201).json({ success: true, task });
});

// @desc    Get all tasks (with optional projectId filter)
// @route   GET /api/tasks?projectId=xxx
// @access  Private
const getAllTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.query;
  let filter = {};

  if (projectId) filter.project = projectId;

  // Members only see tasks assigned to them
  if (req.user.role === "Member") {
    filter.assignedTo = req.user._id;
  }

  const tasks = await Task.find(filter)
    .populate("assignedTo", "name email")
    .populate("project", "title")
    .sort({ dueDate: 1 });

  res.status(200).json({ success: true, count: tasks.length, tasks });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("assignedTo", "name email")
    .populate("project", "title");

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Member can only see their own tasks
  if (
    req.user.role === "Member" &&
    task.assignedTo?._id.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to view this task");
  }

  res.status(200).json({ success: true, task });
});

// @desc    Update task (full update)
// @route   PUT /api/tasks/:id
// @access  Admin
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  const { title, description, dueDate, priority, status, assignedTo } =
    req.body;

  task.title = title || task.title;
  task.description = description || task.description;
  task.dueDate = dueDate || task.dueDate;
  task.priority = priority || task.priority;
  task.status = status || task.status;
  task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;

  await task.save(); // pre-hook sets isOverdue automatically

  res.status(200).json({ success: true, task });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Admin
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  await task.deleteOne();

  res.status(200).json({ success: true, message: "Task deleted" });
});

// @desc    Update task status only (Admin + Member)
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const validStatuses = ["To Do", "In Progress", "Done"];
  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Member can only update their own assigned task
  if (
    req.user.role === "Member" &&
    task.assignedTo?.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to update this task");
  }

  task.status = status;
  await task.save(); // pre-hook updates isOverdue

  res.status(200).json({ success: true, task });
});

export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
};