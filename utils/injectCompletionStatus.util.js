function injectCompletionStatus(task, isCompleted = true) {
  if (!task || typeof task !== 'object') {
    throw new Error('Invalid task object');
  }

  return {
    ...task,
    isCompleted
  };
}

module.exports = injectCompletionStatus;