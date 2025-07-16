const Task = require("../models/TaskSchema");
const JobSimulation = require("../models/JobSimulationSchema");

//  CREATE a new task (recruiter/admin only)
// exports.createTask = async (req, res) => {
//   try {
//     const { simulationId, title, content, resources,completionScore } = req.body;

//     const simulation = await JobSimulation.findById(simulationId);
//     if (!simulation) return res.status(404).json({ message: "Simulation not found" });

//     const task = new Task({
//       simulation: simulationId,
//       title,
//       content,
//       resources,
//       completionScore,
//     });

//     const saved = await task.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(500).json({ message: "Error creating task", error: err.message });
//   }
// };

//  GET all tasks
exports.getAllTasks = async (req, res,next) => {
  try {
    const tasks = await Task.find().populate("simulation", "title");
    res.status(200).json(tasks);
  } catch (err) {
    err.statusCode = 500;
err.message = "Error fetching task";
next(err);

  }
};

//  GET tasks by simulation ID
exports.getTasksBySimulation = async (req, res,next) => {
  try {
    const { simulationId } = req.params;
    const tasks = await Task.find({ simulation: simulationId });

    if (tasks.length === 0)
      return res.status(404).json({ message: "No tasks found for this simulation" });

    res.status(200).json(tasks);
  } catch (err) {
    err.statusCode = 500;
err.message = "Error fetching task";
next(err);

  }
};

// GET task by ID
exports.getTaskById = async (req, res,next) => {
  try {
    const task = await Task.findById(req.params.id).populate("simulationId", "title");
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json(task);
  } catch (err) {
    err.statusCode = 500;
err.message = "Error fetching task";
next(err);

  }
};

//  UPDATE task
exports.updateTask = async (req, res,next) => {
  try {
    const { id } = req.params;
    const { title, content, resources } = req.body;

    const updated = await Task.findByIdAndUpdate(
      id,
      { title, content, resources },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task updated", task: updated });
  } catch (err) {
   err.statusCode = 500;
err.message = "Error updating task";
next(err);

  }
};

//  DELETE task
exports.deleteTask = async (req, res,next) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    err.statusCode = 500;
err.message = "Error deleting task";
next(err);

  }
};