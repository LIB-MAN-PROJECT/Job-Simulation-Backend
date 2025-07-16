const mongoose = require("mongoose");

const taskCompletionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  simulation: { type: mongoose.Schema.Types.ObjectId, ref: "JobSimulation", required: true },
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

taskCompletionSchema.index({ user: 1, task: 1 }, { unique: true }); // prevent duplicates

module.exports = mongoose.models.TaskCompletion || mongoose.model("TaskCompletion", taskCompletionSchema);
