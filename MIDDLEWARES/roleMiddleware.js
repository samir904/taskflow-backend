import asyncHandler from "express-async-handler";

// Only Admin can access
const adminOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied: Admins only");
  }
});

// Admin OR Member (any logged in user)
const memberOrAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.role === "Admin" || req.user.role === "Member")) {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied: Not authorized");
  }
});

export { adminOnly, memberOrAdmin };