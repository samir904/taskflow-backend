import asyncHandler from "express-async-handler";
import Task from "../MODELS/Task.js";
import Project from "../MODELS/Project.js";
import User from "../MODELS/User.js";

const getDashboardStats = asyncHandler(async (req, res) => {
  let taskFilter = {};

  if (req.user.role === "Member") {
    taskFilter.assignedTo = req.user._id;
  }

  const [
    totalTasks,
    todoTasks,
    inProgressTasks,
    doneTasks,
    overdueTasks,
    totalProjects,
    tasksPerUser,
  ] = await Promise.all([
    Task.countDocuments(taskFilter),
    Task.countDocuments({ ...taskFilter, status: "To Do" }),
    Task.countDocuments({ ...taskFilter, status: "In Progress" }),
    Task.countDocuments({ ...taskFilter, status: "Done" }),
    Task.countDocuments({ ...taskFilter, isOverdue: true }),
    req.user.role === "Admin"
      ? Project.countDocuments()
      : Project.countDocuments({ members: req.user._id }),

    req.user.role === "Admin"
      ? Task.aggregate([
          {
            $group: {
              _id: "$assignedTo",
              taskCount: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "_id",
              foreignField: "_id",
              as: "user",
            },
          },
          // ✅ Fixed — correct option name
          {
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              taskCount: 1,
              "user.name": 1,
              "user.email": 1,
            },
          },
          { $sort: { taskCount: -1 } },
        ])
      : [],
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalTasks,
      totalProjects,
      byStatus: {
        todo: todoTasks,
        inProgress: inProgressTasks,
        done: doneTasks,
      },
      overdueTasks,
      tasksPerUser,
    },
  });
});

export { getDashboardStats };