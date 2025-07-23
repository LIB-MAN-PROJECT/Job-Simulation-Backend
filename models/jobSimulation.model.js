const mongoose = require("mongoose");

const jobSimulationSchema = new mongoose.Schema({
  imageUrl:{type:String},
  imagePublicId:{type:String},
  title: { type: String, required: true },
  description: { type: String },
  field: { type: String, enum:['IT','Marketing','Law','Software Development','Database Design','Accounting','Development Studies','Education','Statistics','Business Administration'] },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  companyName: { type: String }, // denormalized 
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tasks' }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  duration: { type: Number }, // in hours
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  isHiring:{type:Boolean},
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("JobSimulation",jobSimulationSchema);