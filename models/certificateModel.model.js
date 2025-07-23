const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String },
    simulationId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSimulation', required: true },
    enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment', required: true },
    certUrl: { type: String, required: true },
    certPublicId: { type: String, required: true, unique: true },
    issuedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Certificate", certificateSchema);
