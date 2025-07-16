const mongoose = require("mongoose");


const EnrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  simulationId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSimulation', required: true },
  progress: { type: Number, default: 0 },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
}, { timestamps: true });

// prevent duplicate enrollments
EnrollmentSchema.index({ user: 1, simulation: 1 }, { unique: true });


module.exports =mongoose.models.Enrollment ||  mongoose.model("Enrollment", EnrollmentSchema);
