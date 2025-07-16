const mongoose = require("mongoose");

const JobSimulationSchema = new mongoose.Schema({
  title: { type: String,  },
  description: { type: String },
  field: { type: String, enum:['IT','Marketing','Law','Software Development','Database Design'] },
  imageUrl: {type: String},

  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  companyName: { type: String }, // denormalized for speed

  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'] },
  duration: { type: Number }, // in days

  taskFileUrl: { type: String },
taskFilePublicId: { type: String },

// addition
companyLogo: {
  type: String,
},

  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  isHiring: { type : Boolean},
  isPublished: { type: Boolean, default: false },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports =mongoose.models.JobSimulation ||  mongoose.model("JobSimulation", JobSimulationSchema);
