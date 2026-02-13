// Generator function example for task statistics
export function* taskStatistics(tasks) {
    // Yield total tasks
    yield {
      label: 'Total Tasks',
      value: tasks.length
    };
    
    // Yield completed tasks
    const completedTasks = tasks.filter(task => task.completed);
    yield {
      label: 'Completed Tasks',
      value: completedTasks.length,
      percentage: tasks.length ? (completedTasks.length / tasks.length * 100).toFixed(1) + '%' : '0%'
    };
    
    // Yield tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dueTodayTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate >= today && dueDate < tomorrow;
    });
    
    yield {
      label: 'Due Today',
      value: dueTodayTasks.length
    };
    
    // Yield overdue tasks
    const overdueTasks = tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    });
    
    yield {
      label: 'Overdue Tasks',
      value: overdueTasks.length
    };
   }