import express from 'express';
import * as taskService from './taskService';
import { Task } from './taskModel';
import { validate, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ServiceResponse } from '../../common/models/serviceResponse';
import { httpStatusCodes } from '../../common/utils/httpHandlers';

const router = express.Router();

class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;
}

router.post('/', async (req, res) => {
  const createTaskDto = plainToInstance(CreateTaskDto, req.body);
  const errors = await validate(createTaskDto);
  if (errors.length > 0) {
    return res.status(httpStatusCodes.BAD_REQUEST).json(new ServiceResponse(false, 'Validation failed', errors, httpStatusCodes.BAD_REQUEST));
  }
  try {
    const task = await taskService.createTask(createTaskDto);
    res.status(httpStatusCodes.CREATED).json(new ServiceResponse(true, 'Task created successfully', task, httpStatusCodes.CREATED));
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json(new ServiceResponse(false, 'Failed to create task', error, httpStatusCodes.INTERNAL_SERVER_ERROR));
  }
});

router.get('/', async (req, res) => {
  try {
    const tasks = await taskService.getTasks();
    res.status(httpStatusCodes.OK).json(new ServiceResponse(true, 'Tasks retrieved successfully', tasks, httpStatusCodes.OK));
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json(new ServiceResponse(false, 'Failed to retrieve tasks', error, httpStatusCodes.INTERNAL_SERVER_ERROR));
  }
});

router.get('/:id', async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
      return res.status(httpStatusCodes.NOT_FOUND).json(new ServiceResponse(false, 'Task not found', null, httpStatusCodes.NOT_FOUND));
    }
    res.status(httpStatusCodes.OK).json(new ServiceResponse(true, 'Task retrieved successfully', task, httpStatusCodes.OK));
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json(new ServiceResponse(false, 'Failed to retrieve task', error, httpStatusCodes.INTERNAL_SERVER_ERROR));
  }
});

class UpdateTaskDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}

router.put('/:id', async (req, res) => {
  const updateTaskDto = plainToInstance(UpdateTaskDto, req.body);
  const errors = await validate(updateTaskDto);
  if (errors.length > 0) {
    return res.status(httpStatusCodes.BAD_REQUEST).json(new ServiceResponse(false, 'Validation failed', errors, httpStatusCodes.BAD_REQUEST));
  }
  try {
    const task = await taskService.updateTask(req.params.id, updateTaskDto);
    if (!task) {
      return res.status(httpStatusCodes.NOT_FOUND).json(new ServiceResponse(false, 'Task not found', null, httpStatusCodes.NOT_FOUND));
    }
    res.status(httpStatusCodes.OK).json(new ServiceResponse(true, 'Task updated successfully', task, httpStatusCodes.OK));
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json(new ServiceResponse(false, 'Failed to update task', error, httpStatusCodes.INTERNAL_SERVER_ERROR));
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const success = await taskService.deleteTask(req.params.id);
    if (!success) {
      return res.status(httpStatusCodes.NOT_FOUND).json(new ServiceResponse(false, 'Task not found', null, httpStatusCodes.NOT_FOUND));
    }
    res.status(httpStatusCodes.OK).json(new ServiceResponse(true, 'Task deleted successfully', null, httpStatusCodes.OK));
  } catch (error) {
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json(new ServiceResponse(false, 'Failed to delete task', error, httpStatusCodes.INTERNAL_SERVER_ERROR));
  }
});

export default router;