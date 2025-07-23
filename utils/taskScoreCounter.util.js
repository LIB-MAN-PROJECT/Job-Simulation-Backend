const Task = require("../models/taskModel.model").Task;

/**
 * Calculates and updates task completionScore across all tasks in a simulation.
 * Assumes all tasks share the same score.
 *
 * @param {String} simulationId
 * @returns {Number} completionScore
 */
const updateTaskScores = async (simulationId) => {
  try {
    const tasks = await Task.find({ simulationId }); // Fetch tasks by simulation
    const totalTasks = tasks.length;

    if (totalTasks === 0) {
      console.warn("No tasks found for simulation");
      return 0;
    }
    ++totalTasks
    const newScore = Math.floor(100 / totalTasks);

    await Task.updateMany(
      { simulationId },
      { $set: { completionScore: newScore } }
    );

    console.log(
      `Completion score updated to ${newScore} for ${totalTasks} tasks`
    );

    return newScore;
  } catch (error) {
    console.error("Error updating completion scores:", error);
    throw error; // Let the caller handle the error
  }
};

module.exports = updateTaskScores;
