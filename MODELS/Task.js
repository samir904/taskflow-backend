import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    isOverdue: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ Fixed — no next parameter
taskSchema.pre("save", function () {
  if (this.status !== "Done" && this.dueDate < new Date()) {
    this.isOverdue = true;
  } else {
    this.isOverdue = false;
  }
});

// ✅ Fixed — no next parameter
taskSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  if (update.dueDate || update.status) {
    const due = update.dueDate || this._update?.dueDate;
    const status = update.status;
    if (status !== "Done" && due && new Date(due) < new Date()) {
      this.set({ isOverdue: true });
    } else {
      this.set({ isOverdue: false });
    }
  }
});

const Task = mongoose.model("Task", taskSchema);
export default Task;