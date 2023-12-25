import { Controller, Post, Body, Param, Get, Delete, Put, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { TaskService } from './task.service';
import { TaskEntity } from './entities/task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    const userId = req.user._id; // Assuming userId is available in the user object from JWT
    const createdTask = await this.taskService.createTask(createTaskDto.taskTitle, createTaskDto.taskDescription, new Date(createTaskDto.taskDueDate), createTaskDto.projectId, userId);

    return { data: createdTask, message: `succesfully created task` }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateTask(@Param('id') taskId: string, @Body() updateTaskDto: UpdateTaskDto) {
    const updatedTask = await this.taskService.updateTask(taskId, updateTaskDto.taskTitle, updateTaskDto.taskDescription, new Date(updateTaskDto.taskDueDate));

    return { data: updatedTask, message: `successfully updated task` }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteTask(@Param('id') taskId: string): Promise<void> {
    return this.taskService.deleteTask(taskId);
  }

  @Get(':id')
  async getTask(@Param('id') taskId: string) {
    return { data: await this.taskService.getTask(taskId), message: `successfully retrieved task` };
  }

  @Get()
  async getTasksByProject(@Query('projectId') projectId: string) {

    if (projectId) {
      return { data: await this.taskService.getTasksByProject(projectId), message: `successfully retrieved tasks within a project` };
    } else {
      throw new BadRequestException(`Please include projectId in your query string`)
    }


  }

  @Get('count/user')
  @UseGuards(AuthGuard('jwt'))
  async getTasksCountForUser(@Req() req: Request) {
    const userId = req.user._id; // Assuming userId is available in the user object from JWT
    return {count: await this.taskService.getTasksCountForUser(userId), message: `successfully retrieved task count`};
  }
}
