import chalk from 'chalk';
 import { TaskProps } from '../models/Task';
 // Typed function parameters and return values
 export const formatTask = (task: TaskProps): string => {
 const status = task.completed 
? chalk.green('✓') 
: chalk.yellow('○');
 const title = task.completed 
? chalk.dim(task.title) 
: chalk.white(task.title);
 const dateFormatter = new Intl.DateTimeFormat('en-US', {
 dateStyle: 'medium',
 timeStyle: 'short'
 });
 const created = dateFormatter.format(new Date(task.createdAt!));
 return `${status} ${title} ${chalk.dim(`[${task.id}] - Created: ${created}`)}`;
 };
 export const formatTaskList = (tasks: TaskProps[]): string => {
 if (tasks.length === 0) {
 return chalk.dim('No tasks found.');
 }
 return tasks.map((task, index) => {
 return `${chalk.blue(index + 1)}. ${formatTask(task)}`;
 }).join('\n');
 };