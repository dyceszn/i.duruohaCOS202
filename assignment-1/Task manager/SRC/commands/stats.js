import chalk from 'chalk';
 import { loadTasks } from '../utils/storage.js';
 import { taskStatistics } from '../utils/statistics.js';
 export default async function showStatistics() {
 try {
 const tasks = await loadTasks();
 console.log(chalk.blue.bold('\nTask Statistics:'));
 console.log('====================');
 // Using the generator function with for-of loop
 for (const stat of taskStatistics(tasks)) {
 const value = stat.percentage 
? `${stat.value} (${stat.percentage})` 
: stat.value;
 console.log(`${chalk.yellow(stat.label)}: ${chalk.green(value)}`);
 }
 console.log('====================');
 } catch (error) {
 console.error(chalk.red('Error showing statistics:'), error);
 }
 }