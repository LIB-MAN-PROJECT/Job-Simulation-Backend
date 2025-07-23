const TaskSubmission = require("../models/TaskSubmisionSchema");
const Task = require("../models/TaskSchema");
const TaskCompletion = require("../models/TaskCompletionSchema");
const Enrollment = require("../models/EnrollmentSchema");


exports.submitTask = async (req, res,next) => {
  try {
    const { taskId } = req.params;
    const { submissionUrl } = req.body;
    const userId = req.user.id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const existing = await TaskSubmission.findOne({ userId, taskId });
    if (existing) {
      return res.status(409).json({ message: "Task already submitted" });
    }

    const newSubmission = new TaskSubmission({
      userId,
      taskId,
      simulationId: task.simulationId,
      submissionUrl,
      isSubmitted: true,
      submittedAt: new Date()
    });

    const saved = await newSubmission.save();
    // Count total tasks in the simulation
const totalTasks = await Task.countDocuments({ simulationId: task.simulationId });

// Count user's submitted tasks for this simulation
const completedTasks = await TaskSubmission.countDocuments({
  userId,
  simulationId: task.simulationId,
  isSubmitted: true
});

// Update or create enrollment record
const enrollment = await Enrollment.findOneAndUpdate(
  { userId, simulationId: task.simulationId },
  {
    $setOnInsert: { userId, simulationId: task.simulationId },
    $set: {
      progress: Math.round((completedTasks / totalTasks) * 100),
      isCompleted: completedTasks === totalTasks
    }
  },
  { upsert: true, new: true }
);


    res.status(201).json({ message: "Task submitted successfully", saved });

  } catch (error) {
//    err.statusCode = 500;
// err.message = "Error submiting task";
// next(err);

//   }

console.error(" Full error:", error); 

  return res.status(500).json({
    success: false,
    message: "Error sumiting task simulation",
    error: error.message,           
    stack: error.stack,             
    full: error                     
  });
  }
};

exports.submitMultipleTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const submissions = req.body.submissions; // [{ taskId, submissionUrl }, ...]

    if (!Array.isArray(submissions)) {
      return res.status(400).json({ message: "Submissions must be an array" });
    }

    const responses = [];

    for (const sub of submissions) {
      const { taskId, submissionUrl } = sub;
      const task = await Task.findById(taskId);
      if (!task) {
        responses.push({ taskId, status: "failed", reason: "Task not found" });
        continue;
      }

      const existing = await TaskSubmission.findOne({ userId, taskId });
      if (existing) {
        responses.push({ taskId, status: "skipped", reason: "Already submitted" });
        continue;
      }

      console.log("userId:", userId); 
console.log("taskId:", taskId);


      const newSubmission = new TaskSubmission({
        userId,
        taskId,
        simulationId: task.simulationId,
        submissionUrl,
        isSubmitted: true,
        submittedAt: new Date(),
      });

      await newSubmission.save();
      responses.push({ taskId, status: "success" });
    }

    return res.status(201).json({
      message: "Task submission process complete",
      results: responses,
    });

  } catch (error) {
    console.error("submitMultipleTasks error:", error);
    return res.status(500).json({
      message: "Something went wrong during submission",
      error: error.message,
    });
  }
};


// Optional: GET submission for a user (e.g., for display)
exports.getUserSubmissions = async (req, res,next) => {
  try {
    const submissions = await TaskSubmission.find({ userId: req.user.id }).populate("taskId", "title");
    res.status(200).json(submissions);
  } catch (err) {
    err.statusCode = 500;
err.message = "Error fetching submisions";
next(err);

  }
};

// For recruiters to mark submitted tasks
exports.markTaskSubmission = async (req, res, next) => {
  try {
    const { submissionId } = req.params;
    const { reviewStatus, reviewerComment } = req.body;

    if (!["approved", "rejected", "pending"].includes(reviewStatus)) {
      return res.status(400).json({ message: "Invalid review status" });
    }

    const submission = await TaskSubmission.findById(submissionId).populate("taskId");
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    submission.reviewStatus = reviewStatus;
    submission.reviewerComment = reviewerComment || ""; // optional
    await submission.save();

    //  If recruiter approved the task, mark it as completed
if (reviewStatus === "approved") {
  await TaskCompletion.findOneAndUpdate(
    { userId: submission.userId, taskId: submission.taskId },
    {
      userId: submission.userId,
      taskId: submission.taskId,
      simulationId: submission.simulationId,
      completedAt: new Date()
    },
    { upsert: true, new: true }
  );

  //  Update Enrollment progress
  const totalTasks = await Task.countDocuments({ simulationId: submission.simulationId });
  const completedTasks = await TaskCompletion.countDocuments({ userId: submission.userId, simulationId: submission.simulationId });

  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);

  await Enrollment.findOneAndUpdate(
    { userId: submission.userId, simulationId: submission.simulationId },
    {
      progressPercentage,
      isCompleted: completedTasks === totalTasks
    },
    { upsert: true, new: true }
  );
}


    res.status(200).json({
      message: `Task marked as ${reviewStatus}`,
      taskTitle: submission.taskId?.title || "Untitled Task",
      reviewerComment: submission.reviewerComment
    });

  } catch (err) {
    err.statusCode = 500;
    err.message = "Error marking task submission";
    next(err);
  }
};
