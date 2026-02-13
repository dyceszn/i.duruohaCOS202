import inquirer from 'inquirer';
import chalk from 'chalk';
import { loadTasks, saveTasks } from '../utils/storage.js';
import { formatTaskList } from '../utils/formatters.js';
export default async function deleteTask() {
 try {
   // Load tasks
   const tasks = await loadTasks();
   
   if (tasks.length === 0) {
     console.log(chalk.yellow('No tasks to delete.'));
     return;
   }
   
   // Show tasks for selection
   console.log(chalk.blue('\nSelect a task to delete:'));
   console.log(formatTaskList(tasks));
   
   // Prompt for task selection
   const { taskIndex, confirm } = await inquirer.prompt([
     {
       type: 'number',
       name: 'taskIndex',
       message: 'Enter task number:',
       validate: input => {
         const index = Number(input) - 1;
         return (index >= 0 && index < tasks.length) 
           ? true 
           : 'Please enter a valid task number';
       }
     },
     {
       type: 'confirm',
       name: 'confirm',
       message: 'Are you sure you want to delete this task?',
       default: false
     }
   ]);
   
   if (!confirm) {
     console.log(chalk.yellow('Operation cancelled.'));
     return;
   }
   
   // Convert to 0-based index
   const index = taskIndex - 1;
   
   // Get task title for confirmation message
   const taskTitle = tasks[index].title;
   
   // Remove task - array filter method
   const updatedTasks = tasks.filter((_, i) => i !== index);
   
   // Save updated tasks
   await saveTasks(updatedTasks);
   
   // Display result
   console.log(chalk.green(`✓ Task "${taskTitle}" deleted successfully!`));
   
 } catch (error) {
   console.error(chalk.red('Error deleting task:'), error);
 }
}

