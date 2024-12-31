import { Task } from './taskModel';
import { v4 as uuidv4 } from 'uuid';

const tasks: Task[] = [];

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  const newTask: Task = {
    id: uuidv4(),
    ...task,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  tasks.push(newTask);
  return newTask;
};

export const getTasks = async (): Promise<Task[]> => {
  return tasks;
};

export const getTaskById = async (id: string): Promise<Task | undefined> => {
  return tasks.find((task) => task.id === id);
};

export const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Task | undefined> => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    return undefined;
  }
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date(),
  };
  return tasks[taskIndex];
};

export const deleteTask = async (id: string): Promise<boolean> => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) {
    return false;
  }
  tasks.splice(taskIndex, 1);
  return true;
};