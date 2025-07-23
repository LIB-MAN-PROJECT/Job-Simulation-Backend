/**
 * Enhances a list of tasks with per-user completion flags.
 * 
 * @param {Array} tasks - Array of task objects (plain or lean)
 * @param {Set} completedTaskIds - Set of taskId strings submitted by the user
 * @returns {Array} Decorated task array with isCompleted flags
 */
function injectCompletionMap(tasks, completedTaskIds = new Set()) {
  if (!Array.isArray(tasks)) {
    throw new Error('Tasks must be an array');
  }

  return tasks.map(task => ({
    ...task,
    isCompleted: completedTaskIds.has(task._id.toString())
  }));
}

module.exports=injectCompletionMap