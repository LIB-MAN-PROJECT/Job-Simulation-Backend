const TaskCompletion = require("../models/TaskCompletionSchema");
const Task = require("../models/TaskSchema");
const Enrollment = require("../models/EnrollmentSchema");
const TaskSubmission = require("../models/TaskSubmisionSchema")

exports.markAsComplete = async (req, res,next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    //  Block if task hasn't been submitted
    const submitted = await TaskSubmission.findOne({ userId, taskId, isSubmitted: true });
    if (!submitted) {
      return res.status(400).json({ message: "You must submit the task before marking it as complete" });
    }

   
    // Prevent duplicate completions
    const exists = await TaskCompletion.findOne({ user: userId, task: taskId });
    if (exists) return res.status(409).json({ message: "Already marked as completed" });

    const record = new TaskCompletion({
      user: userId,
      task: taskId,
      simulation: task.simulation
    });

    const saved = await record.save();

     // Update enrollment progress afther marking as complete
const totalTasks = await Task.countDocuments({ simulationId: task.simulationId });
const completedTasks = await TaskCompletion.countDocuments({
  user: userId,
  simulation: task.simulationId
});

const progressPercentage = (completedTasks / totalTasks) * 100;

await Enrollment.findOneAndUpdate(
  { user: userId, simulationId: task.simulationId },
  { progress: progressPercentage },
  { new: true }
);
     res.status(201).json({ 
      message: "Task marked as completed", 
      progress: progressPercentage,
      saved 
    });
  } catch (err) {
    err.statusCode = 500;
err.message = "Error marking task";
next(err);

  }
};
