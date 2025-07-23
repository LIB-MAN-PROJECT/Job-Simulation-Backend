const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  firstName: {type:String},
  lastName:{type:String},
  simulationId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSimulation', required: true },
  progress: { type: Number, default: 0 },
  taskSubmissions:[{type:mongoose.Schema.Types.ObjectId,ref:'TaskSubmission'}],
  enrolledAt: { type: Date},
  completedAt: { type: Date },
  isReadyForReview:{type:Boolean},
  isReviewed:{type:Boolean},
  feedbackState:{type:String, enum:["Accepted",'Pending','Rejected']},
  reviewedAt: Date,
  feedback: String
}, { timestamps: true });

// preventing duplicate enrollments
enrollmentSchema.index({ userId: 1, simulationId: 1 }, { unique: true });

module.exports= mongoose.model("Enrollment",enrollmentSchema);