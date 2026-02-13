// ES6 module with promises and async/await for file operations
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Get directory name in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../../data.json');
// Using async/await for cleaner asynchronous code
export async function loadTasks() {
try {
// Check if file exists
await fs.access(DATA_FILE);
// Read and parse data
const data = await fs.readFile(DATA_FILE, 'utf8');
return JSON.parse(data);
} catch (error) {
// Return empty array if file doesn't exist
if (error.code === 'ENOENT') {
return [];
}
throw error;
}
}
export async function saveTasks(tasks) {
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
