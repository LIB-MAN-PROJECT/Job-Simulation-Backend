const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName:{type:String},
    lastName:{type:String},
    fullName:{type:String},
    simulationId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobSimulation', required: true },
    rating: { type: Number, min: 1, max: 5 },
    message: { type: String }
}, { timestamps: true });

//allowing only one review per user per simulation
reviewSchema.index({ userId: 1, simulationId: 1 }, { unique: true });

module.exports = mongoose.model("review", reviewSchema);
