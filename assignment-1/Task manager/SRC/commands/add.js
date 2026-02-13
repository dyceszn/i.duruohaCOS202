import inquirer from 'inquirer';
import chalk from 'chalk';
import Task from '../models/task.js';
import { loadTasks, saveTasks } from '../utils/storage.js';
// Export default async function
export default async function addTask() {
// Prompt the user for task details
const answers = await inquirer.prompt([
{
type: 'input',
name: 'title',
message: 'Enter task title:',
validate: input => input.trim() !== '' ? true : 'Title is required'
},
{
type: 'input',
name: 'description',
message: 'Enter task description (optional):'
},
{
type: 'confirm',
name: 'hasDueDate',
message: 'Does this task have a due date?',
default: false
},
{
type: 'input',
name: 'dueDate',
message: 'Enter due date (YYYY-MM-DD):',
when: answers => answers.hasDueDate,
validate: input => {
const date = new Date(input);
return !isNaN(date) ? true : 'Please enter a valid date';
}
}
]);
try {
    // Load existing tasks
    const tasks = await loadTasks();
    // Destructuring to extract properties
    const { title, description, dueDate } = answers;
    // Create a new task using class constructor
    const newTask = new Task(title, description, dueDate || null);
    // Add to array - spread operator to create new array
    const updatedTasks = [...tasks, newTask.toObject()];
    // Save tasks
    await saveTasks(updatedTasks);
    console.log(chalk.green('✓ Task added successfully!'));
    } catch (error) {
    console.error(chalk.red('Error adding task:'), error);
    }
    }
    
