const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  simulationId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSimulation', required: true },
  title: { type: String, required: true },
  content: { type: String },
  completionScore: {type: Number,default:20},
  resources: [{ type: String }] // URLs
}, { timestamps: true });


module.exports =mongoose.models.Task||  mongoose.model("Task", TaskSchema);
