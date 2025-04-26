import { Request, Response } from 'express';
import Task from '../models/taskModel';

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const filter: any = {};
    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });
       

    const total = await Task.countDocuments(filter);
    const totalPages = Math.ceil(total / +limit);

    res.json({
      tasks,
      totalPages,
      currentPage: +page
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTask = async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
};
