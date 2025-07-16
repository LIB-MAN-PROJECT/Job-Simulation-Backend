const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String }, // denormalized
  simulation: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSimulation', required: true },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String }
}, { timestamps: true });

// one review per user per simulation
ReviewSchema.index({ user: 1, simulation: 1 }, { unique: true });

module.exports =mongoose.models.Review ||  mongoose.model("Review", ReviewSchema);
