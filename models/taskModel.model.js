const mongoose = require("mongoose");

//TODO: Restrict number of tasks
//TODO: Include file uploads for tasks
const taskSchema = new mongoose.Schema({
  simulationId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSimulation', required: true },
  taskNumber: {type:Number},
  title: { type: String, required: true },
  content: { type: String },//fileURL or file
  completionScore: { type: Number},
  isCompleted: {type:Boolean},
  resources: [{ type: String }] // URLs
}, { timestamps: true });

const taskSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName:{type:String},
  lastName: { type: String }, //denormalized
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tasks', required: true },
  simulationId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSimulation', required: true },
  submissionUrl: { type: String },//URL
  submissionPublicId:{type:String},
  isSubmitted: { type: Boolean, default: false },
  submittedAt: { type: Date ,default: Date.now()}
}, { timestamps: true });

//preventing duplicate submissions for the same Task
taskSubmissionSchema.index({ userId: 1, taskId: 1 }, { unique: true });

module.exports = {
  Task: mongoose.model("Tasks", taskSchema),
  TaskSubmission: mongoose.model("TaskSubmission", taskSubmissionSchema)
}