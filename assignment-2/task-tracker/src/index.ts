import chalk from "chalk";
import inquirer from "inquirer";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Task, { Category, Priority, TaskData } from "./Task.js";

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "../data.json");

// Task list with type annotation
let tasks: Task[] = [];

// TypeScript version
const showStatistics = (): void => {
  console.log(chalk.blue("\n=== Task Statistics ==="));
  if (tasks.length === 0) {
    console.log(chalk.yellow("No tasks found."));
    return;
  }
  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  // Count tasks by category
  const categoryCounts: Record<string, number> = {};
  tasks.forEach((task) => {
    categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1;
  });
  // Display statistics
  console.log(`${chalk.yellow("Total Tasks:")} ${chalk.green(totalTasks)}`);
  console.log(`${chalk.yellow("Completed:")} ${chalk.green(completedTasks)}
(${((completedTasks / totalTasks) * 100).toFixed(0)}%)`);
  console.log(`${chalk.yellow("Pending:")} ${chalk.green(pendingTasks)}
(${((pendingTasks / totalTasks) * 100).toFixed(0)}%)`);
  console.log(chalk.yellow("\nTasks by Category:"));
  Object.entries(categoryCounts).forEach(([category, count]) => {
    const categoryColor = getCategoryColor(category as Category);
    console.log(
      `${categoryColor(category)}: ${chalk.green(count)} (${(
        (count / totalTasks) *
        100
      ).toFixed(0)}%)`
    );
  });
  console.log(""); // Empty line for spacing
};

interface SearchAnswers {
  searchTerm: string;
}

export const searchTasks = async (): Promise<void> => {
  // Prompt for search term
  const { searchTerm }: SearchAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "searchTerm",
      message: "Enter search term:",
      validate: (input: string) =>
        input.trim() ? true : "Search term is required",
    },
  ]);
  // Filter tasks based on the search term
  const term = searchTerm.toLowerCase().trim();
  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(term) ||
      (task.description && task.description.toLowerCase().includes(term))
  );
  console.log(chalk.blue(`\n=== Search Results for "${searchTerm}" ===`));
  if (filteredTasks.length === 0) {
    console.log(chalk.yellow("No matching tasks found."));
    return;
  }
  // Display filtered tasks
  filteredTasks.forEach((task, index) => {
    const status = task.completed ? chalk.green("✓") : chalk.yellow("○");
    const title = task.completed
      ? chalk.dim(task.title)
      : chalk.white(task.title);
    // Highlight the search term in title and description
    const highlightedTitle = highlightSearchTerm(title, term);
    const categoryText = getCategoryColor(task.category as Category)(
      `[${task.category}]`
    );
    console.log(`${index + 1}. ${status} ${highlightedTitle} ${categoryText}`);
    if (task.description) {
      const highlightedDesc = highlightSearchTerm(
        chalk.dim(task.description),
        term
      );
      console.log(` ${highlightedDesc}`);
    }
  });
  console.log(""); // Empty line for spacing
};
// Helper function to highlight search term (simple version)
const highlightSearchTerm = (text: string, term: string): string => {
  // This is a simple implementation that might not work perfectly with chalkcolored
  text;
  // For a production app, you would need a more sophisticated approach
  return text;
};

// Load tasks from file
const loadTasks = async (): Promise<void> => {
  try {
    // Check if file exists
    await fs.access(DATA_FILE);
    // Read and parse the file
    const data = await fs.readFile(DATA_FILE, "utf8");
    // Convert plain objects to Task instances with type annotations
    const taskData: TaskData[] = JSON.parse(data);
    tasks = taskData.map((obj) => Task.fromObject(obj));
    console.log(chalk.green("Tasks loaded successfully!"));
  } catch (error: any) {
    // Type annotation for error
    // If file doesn't exist, create empty tasks array
    if (error.code === "ENOENT") {
      tasks = [];
    } else {
      console.error(chalk.red("Error loading tasks:"), error);
    }
  }
};

// Save tasks to file
const saveTasks = async (): Promise<void> => {
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(DATA_FILE);
    await fs.mkdir(dir, { recursive: true }).catch(() => {});
    // Write tasks to file
    await fs.writeFile(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
    console.log(chalk.green("Tasks saved successfully!"));
  } catch (error) {
    console.error(chalk.red("Error saving tasks:"), error);
  }
};

// View tasks
const viewTasks = (): void => {
  console.log(chalk.blue("\n=== Your Tasks ==="));
  if (tasks.length === 0) {
    console.log(chalk.yellow("No tasks found."));
    return;
  }
  tasks.forEach((task, index) => {
    const status = task.completed ? chalk.green("✓") : chalk.yellow("○");
    const title = task.completed
      ? chalk.dim(task.title)
      : chalk.white(task.title);
    // Add category to the output
    const categoryColor = getCategoryColor(task.category as Category);
    const categoryText = categoryColor(`[${task.category}]`);

    const date = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(task.createdAt);

    // Color code based on priority
    let priorityColor = chalk.white; // Default to white
    switch (task.priority) {
      case "low":
        priorityColor = chalk.green;
        break;
      case "medium":
        priorityColor = chalk.yellow;
        break;
      case "high":
        priorityColor = chalk.red;
        break;
    }

    // Highlight overdue tasks
    const overdue = task.isOverdue() ? chalk.bgRed.white(" Overdue ") : "";
    const dueDateStr = task.dueDate
      ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
          task.dueDate
        )
      : "No due date";

    console.log(
      `${index + 1}. ${status} ${title} ${chalk.dim(
        `(created: ${date})`
      )} ${priorityColor(`[${task.priority}]`)} ${overdue} Due: ${chalk.cyan(
        dueDateStr
      )}`
    );
    if (task.description) {
      console.log(` ${chalk.dim(task.description)}`);
    }
  });
  console.log(""); // Empty line for spacing
};

// Helper function to get color for a category
const getCategoryColor = (category: Category): Function => {
  const colors: Record<Category, Function> = {
    work: chalk.blue,
    personal: chalk.magenta,
    shopping: chalk.green,
    general: chalk.yellow,
    other: chalk.white,
  };
  return colors[category] || chalk.white;
};

// Interface for inquirer prompt results
interface AddTaskAnswers {
  title: string;
  description: string;
  priority: Priority; // Add priority property
  dueDate: string; // Add dueDate property
  category: Category; // Add this line
}

// Add a task
const addTask = async (): Promise<void> => {
  const answers: AddTaskAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter task title:",
      validate: (input: string) => (input.trim() ? true : "Title is required"),
    },
    {
      type: "input",
      name: "description",
      message: "Enter task description (optional):",
    },
    {
      type: "list", // Add a prompt to select priority
      name: "priority",
      message: "Select task priority:",
      choices: ["low", "medium", "high"],
      default: "medium",
    },
    {
      type: "input", // Prompt for due date
      name: "dueDate",
      message: "Enter task due date (optional, format: YYYY-MM-DD):",
      validate: (input: string) => {
        if (!input) return true; // No input is fine
        // Check if the input matches the format YYYY-MM-DD
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(input) && !isNaN(Date.parse(input))
          ? true
          : "Invalid date format. Please use YYYY-MM-DD.";
      },
    },
    {
      type: "list",
      name: "category",
      message: "Select category:",
      choices: ["work", "personal", "general", "shopping", "other"],
      default: "general",
    },
  ]);
  const dueDate = answers.dueDate ? new Date(answers.dueDate) : null;
  const task = new Task(
    answers.title.trim(),
    answers.description.trim(),
    answers.priority,
    dueDate,
    answers.category
  ); // Pass priority to constructor
  tasks = [...tasks, task];
  await saveTasks();
  console.log(chalk.green(`Task "${answers.title}" added successfully!`));
};

// Interface for task selection prompt results
interface TaskSelectAnswers {
  taskIndex: number;
}

// Complete a task
const completeTask = async (): Promise<void> => {
  if (tasks.length === 0) {
    console.log(chalk.yellow("No tasks to complete!"));
    return;
  }

  // Show tasks for selection
  viewTasks();
  const { taskIndex }: TaskSelectAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "taskIndex",
      message: "Enter task number to complete:",
      validate: (input: string) => {
        const index = Number(input) - 1;
        return !isNaN(index) && index >= 0 && index < tasks.length
          ? true
          : "Please enter a valid task number";
      },
      filter: (input: string) => Number(input),
    },
  ]);

  // Convert to 0-based index
  const index = taskIndex - 1;
  // Check for out-of-bounds index
  if (index < 0 || index >= tasks.length) {
    console.log(chalk.red("Invalid task selection!"));
    return;
  }
  // Toggle completion status using class method
  tasks[index].toggleComplete();
  // Save tasks
  await saveTasks();
  const status = tasks[index].completed ? "completed" : "incomplete";
  console.log(chalk.green(`Task marked as ${status}!`));
};

// Interface for delete confirmation prompt
interface DeleteConfirmAnswers {
  confirm: boolean;
}

// Delete a task
const deleteTask = async (): Promise<void> => {
  if (tasks.length === 0) {
    console.log(chalk.yellow("No tasks to delete!"));
    return;
  }

  // Show tasks for selection
  viewTasks();
  const { taskIndex }: TaskSelectAnswers = await inquirer.prompt([
    {
      type: "input",
      name: "taskIndex",
      message: "Enter task number to delete:",
      validate: (input: string) => {
        const index = Number(input) - 1;
        return !isNaN(index) && index >= 0 && index < tasks.length
          ? true
          : "Please enter a valid task number";
      },
      filter: (input: string) => Number(input),
    },
  ]);

  // Convert to 0-based index
  const index = taskIndex - 1;
  // Check for out-of-bounds index
  if (index < 0 || index >= tasks.length) {
    console.log(chalk.red("Invalid task selection!"));
    return;
  }

  const taskTitle = tasks[index].title;
  // Confirm deletion
  const { confirm }: DeleteConfirmAnswers = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: `Are you sure you want to delete the task "${taskTitle}"?`,
      default: false,
    },
  ]);

  // Proceed with deletion
  if (confirm) {
    tasks = tasks.filter((_, idx) => idx !== index);
    await saveTasks();
    console.log(chalk.green(`Task "${taskTitle}" deleted successfully!`));
  } else {
    console.log(chalk.yellow("Task deletion canceled."));
  }
};

const mainMenu = async (): Promise<void> => {
  const answers: { action: string } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Choose an action:",
      choices: [
        "View tasks",
        "Add task",
        "Complete task",
        "Delete task",
        "Search tasks",
        "Show statistics",
        "Exit",
      ],
    },
  ]);

  switch (answers.action) {
    case "View tasks":
      viewTasks();
      break;
    case "Add task":
      await addTask();
      break;
    case "Complete task":
      await completeTask();
      break;
    case "Delete task":
      await deleteTask();
      break;
    case "Search tasks":
      await searchTasks();
      break;
    case "Show statistics":
      showStatistics();
      break;
    case "Exit":
      console.log(chalk.green("Goodbye!"));
      process.exit(0);
  }

  // Prompt the user for next action
  await mainMenu();
};

// Initialize the app by loading tasks and showing the menu
const init = async (): Promise<void> => {
  await loadTasks();
  await mainMenu();
};

// Start the app
init();
