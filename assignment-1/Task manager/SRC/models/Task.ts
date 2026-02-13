// TypeScript interface for Task properties
interface TaskProps {
    id?: string;
    title: string;
    description?: string;
    dueDate?: Date | null;
    completed?: boolean;
    createdAt?: Date;
    }
    // Using nanoid with TypeScript
    import { nanoid } from 'nanoid';
    export default class Task {
    id: string;
    title: string;
    description: string;
    dueDate: Date | null;
    completed: boolean;
    createdAt: Date;
    // Constructor with typed parameters and default values
    constructor(
    title: string, 
   description: string = '', 
   dueDate: Date | null = null
    ) {
    this.id = nanoid(8);
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.completed = false;
    this.createdAt = new Date();
    }
    // Method with return type
    toggleComplete(): Task {
    this.completed = !this.completed;
    return this;
    }
    // Static method with parameter and return types
    static fromObject(obj: TaskProps): Task {
    const task = new Task(
    obj.title,
    obj.description || '',
    obj.dueDate || null
    );
    if (obj.id) task.id = obj.id;
    if (obj.completed !== undefined) task.completed = obj.completed;
    if (obj.createdAt) task.createdAt = new Date(obj.createdAt);
    return task;
    }
    // Convert to plain object
    toObject(): TaskProps {
    return {
    id: this.id,
    title: this.title,
    description: this.description,
    dueDate: this.dueDate,
    completed: this.completed,
    createdAt: this.createdAt
    };
    }
    }