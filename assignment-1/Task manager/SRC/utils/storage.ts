import { promises as fs } from 'fs';
 import path from 'path';
 import { fileURLToPath } from 'url';
 import { TaskProps } from '../models/Task';
 // Get directory name in ES modules
 const __dirname = path.dirname(fileURLToPath(import.meta.url));
 const DATA_FILE = path.join(__dirname, '../../data.json');
 // Function with return type
 export async function loadTasks(): Promise<TaskProps[]> {
 try {
 // Check if file exists
 await fs.access(DATA_FILE);
 // Read and parse data
 const data = await fs.readFile(DATA_FILE, 'utf8');
 return JSON.parse(data);
 } catch (error: any) {
 // Return empty array if file doesn't exist
 if (error.code === 'ENOENT') {
 return [];
 }
 throw error;
 }
 }
 // Function with parameter and return type
 export async function saveTasks(tasks: TaskProps[]): Promise<boolean> {
 // Create directory if it doesn't exist
 const dir = path.dirname(DATA_FILE);
 try {
 await fs.access(dir);
 } catch {
 await fs.mkdir(dir, { recursive: true });
 }
 // Write tasks to file
 await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), 'utf8');
 return true;
 }