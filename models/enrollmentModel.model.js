const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  firstName: {type:String},
  lastName:{type:String},
  simulationId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSimulation', required: true },
  progress: { type: Number, default: 0 },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  isReadyForReview:{type:Boolean},
  isReviewed:{type:Boolean},
  reviewState:{type:String, enum:['Accepted','Pending ','Rejected']},
}, { timestamps: true });

// preventing duplicate enrollments
enrollmentSchema.index({ userId: 1, simulationId: 1 }, { unique: true });

module.exports= mongoose.model("enrollment",enrollmentSchema);