import chalk from 'chalk';
import { loadTasks } from '../utils/storage.js';
import { formatTaskList } from '../utils/formatters.js';
export default async function listTasks() {
try {
// Load tasks
const tasks = await loadTasks();
console.log(chalk.blue.bold('\nYour Tasks:'));
console.log('====================');
// Output tasks using the formatter
console.log(formatTaskList(tasks));
console.log('====================');
// Array methods: filter and reduce
const completed = tasks.filter(task => task.completed).length;
const remaining = tasks.length - completed;
console.log(chalk.blue(`Stats: ${tasks.length} total, `) +
chalk.green(`${completed} completed, `) +
chalk.yellow(`${remaining} remaining`));
} catch (error) {
console.error(chalk.red('Error listing tasks:'), error);
}
}

