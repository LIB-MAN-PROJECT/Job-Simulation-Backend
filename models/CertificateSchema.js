const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  simulationId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSimulation', required: true },
  simulationName:{type: String},
  certUrl: { type: String, required: true },
  certId: { type: String, required: true, unique: true },
  issuedAt: { type: Date, default: Date.now }
}, { timestamps: true });



module.exports = mongoose.models.Certificate || mongoose.model("Certificate", CertificateSchema);