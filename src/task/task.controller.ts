import { Controller, Post, Body, Param, Get, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TaskService } from './task.service';
import { TaskEntity } from './entities/task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req: Request): Promise<TaskEntity> {
    const userId = req.user.userId; // Assuming userId is available in the user object from JWT
    return this.taskService.createTask(createTaskDto.taskTitle, createTaskDto.taskDescription, createTaskDto.taskDueDate, createTaskDto.projectId, userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateTask(@Param('id') taskId: string, @Body() updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    return this.taskService.updateTask(taskId, updateTaskDto.taskTitle, updateTaskDto.taskDescription, updateTaskDto.taskDueDate);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteTask(@Param('id') taskId: string): Promise<void> {
    return this.taskService.deleteTask(taskId);
  }

  @Get(':id')
  async getTask(@Param('id') taskId: string): Promise<TaskEntity> {
    return this.taskService.getTask(taskId);
  }

  @Get('project/:projectId')
  async getTasksByProject(@Param('projectId') projectId: string): Promise<TaskEntity[]> {
    return this.taskService.getTasksByProject(projectId);
  }

  @Get('count/user')
  @UseGuards(AuthGuard('jwt'))
  async getTasksCountForUser(@Req() req: Request): Promise<number> {
    const userId = req.user.userId; // Assuming userId is available in the user object from JWT
    return this.taskService.getTasksCountForUser(userId);
  }
}
