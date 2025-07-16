const Enrollment = require("../models/EnrollmentSchema");
const JobSimulation = require("../models/JobSimulationSchema");

// Enroll in a simulation
exports.enrollInSimulation = async (req, res,next) => {
  try {
    const { simulationId } = req.body;

    const alreadyEnrolled = await Enrollment.findOne({
      user: req.user.id,
      simulationId
    });

    if (alreadyEnrolled) {
      return res.status(409).json({ message: "Already enrolled in this simulation" });
    }

    const simulationExists = await JobSimulation.findById(simulationId);
    if (!simulationExists) {
      return res.status(404).json({ message: "Simulation not found" });
    }

    const enrollment = new Enrollment({
      user: req.user.id,
      simulationId
    });

    await enrollment.save();
    //  Update the simulation's participants list (add only once)
    await JobSimulation.findByIdAndUpdate(
      simulationId,
      { $addToSet: { participants: req.user.id } } // prevents duplicates
    );

    res.status(201).json({ message: "Enrollment successful", enrollment });
  } catch (err) {
    err.statusCode = 500;
err.message = "Enrollment failed";
next(err);

  }
};

// Get all enrollments of logged-in user
exports.getMyEnrollments = async (req, res,next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate("simulationId", "title field");

    res.status(200).json(enrollments);
  } catch (err) {
    err.statusCode = 500;
err.message = "failed to fetch enrollment";
next(err);

  }
};

// Get users enrolled in a specific simulation (recruiter/admin)
exports.getEnrolledUsers = async (req, res,next) => {
  try {
    const { simulationId } = req.params;

    const users = await Enrollment.find({ simulationId })
      .populate("user", "username email");

    res.status(200).json(users);
  } catch (err) {
    err.statusCode = 500;
err.message = "Error fetching enrollment";
next(err);

  }
};

// Unenroll from a simulation
exports.unenroll = async (req, res,next) => {
  try {
    const { simulationId } = req.params;

    const deleted = await Enrollment.findOneAndDelete({
      user: req.user.id,
      simulationId
    });

    if (!deleted) {
      return res.status(404).json({ message: "You are not enrolled in this simulation" });
    }
    //  remove user from participants list
    await JobSimulation.findByIdAndUpdate(
      simulationId,
      { $pull: { participants: req.user.id } }
    );

    res.status(200).json({ message: "Unenrolled successfully" });
  } catch (err) {
   err.statusCode = 500;
err.message = "failed to unenroll";
next(err);

  }
};
