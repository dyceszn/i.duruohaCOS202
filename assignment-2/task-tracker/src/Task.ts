// Task.ts
export type Priority = "low" | "medium" | "high";
export type Category = "work" | "personal" | "general" | "shopping" | "other";

export interface TaskData {
  title: string;
  completed?: boolean;
  createdAt?: Date | string;
  description?: string;
  priority?: Priority; // Add priority to TaskData interface
  dueDate: Date | null; // Add dueDate property
  category: Category; // Add this line
}

export default class Task {
  title: string;
  completed: boolean;
  createdAt: Date;
  description: string;
  priority: Priority; // Add priority property
  dueDate: Date | null; // Add dueDate property
  category: Category; // Add this line

  constructor(
    title: string,
    description: string = "",
    priority: Priority = "medium",
    dueDate: Date | null = null, // Initialize dueDate correctly
    category: Category = "general" // Initialize category with default value
  ) {
    this.title = title;
    this.description = description;
    this.completed = false;
    this.createdAt = new Date();
    this.priority = priority; // Initialize priority
    this.dueDate = dueDate; // Properly assign dueDate here
    this.category = category; // Add this line
  }

  toggleComplete(): Task {
    this.completed = !this.completed;
    return this;
  }

  isOverdue(): boolean {
    if (!this.dueDate || this.completed) return false;
    return this.dueDate < new Date();
  }

  // Static method to handle priority when creating tasks from data
  static fromObject(obj: TaskData): Task {
    const task = new Task(
      obj.title,
      obj.description || "",
      obj.priority || "medium",
      obj.dueDate ? new Date(obj.dueDate) : null, // Ensure dueDate is correctly parsed
      obj.category // Ensure category is passed to constructor
    );
    if (obj.completed !== undefined) {
      task.completed = obj.completed;
    }
    if (obj.createdAt) {
      task.createdAt = new Date(obj.createdAt);
    }
    return task;
  }
}
