import { Task } from './taskModel';
import * as taskRepository from './taskRepository';

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  return taskRepository.createTask({ ...task, completed: false });
};

export const getTasks = async (): Promise<Task[]> => {
  return taskRepository.getTasks();
};

export const getTaskById = async (id: string): Promise<Task | undefined> => {
  return taskRepository.getTaskById(id);
};

export const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Task | undefined> => {
  return taskRepository.updateTask(id, updates);
};

export const deleteTask = async (id: string): Promise<boolean> => {
  return taskRepository.deleteTask(id);
};