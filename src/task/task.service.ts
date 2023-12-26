import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskEntity, TaskEntityDocument } from './entities/task.entity';
import { Model } from 'mongoose';
import { ProjectService } from '../project/project.service';

@Injectable()
export class TaskService {

    constructor(@InjectModel(TaskEntity.name) private taskEntityRepository: Model<TaskEntityDocument>, private projectService: ProjectService) {}

    // Create a new task
    async createTask(taskTitle: string, taskDescription: string, taskDueDate: Date, projectId: string, userId: string): Promise<TaskEntity> {
    
        // const projectExists = await this.projectService.getProjectByProjectId(projectId);
        // if(!projectExists){
        //     throw new NotFoundException(`Project specified does not exist`);
        // }

        // Trim and check if task with the same title already exists (case-insensitive)
        const trimmedTaskTitle = taskTitle.trim();
        const existingTask = await this.taskEntityRepository.findOne({ taskTitle: { $regex: new RegExp(trimmedTaskTitle, 'i') } });
        if (existingTask) {
            throw new ConflictException('Task with this title already exists');
        }

        const newTask = await this.taskEntityRepository.create({
            taskTitle: trimmedTaskTitle,
            taskDescription,
            taskDueDate,
            projectId,
            userId
        });

        return newTask;
    }

    // Update an existing task
    async updateTask(taskId: string, taskTitle: string, taskDescription: string, taskDueDate: Date): Promise<TaskEntity> {
        
        // Trim and check if task with the new title already exists (case-insensitive)
        const trimmedTaskTitle = taskTitle.trim();
        const existingTask = await this.taskEntityRepository.findOne({ taskTitle: { $regex: new RegExp(trimmedTaskTitle, 'i') } });
        if (existingTask && existingTask.id !== taskId) {
            throw new ConflictException('Another task with this title already exists');
        }

        const task = await this.taskEntityRepository.findById(taskId);
        if (!task) {
            throw new NotFoundException('Task not found');
        }

        task.taskTitle = trimmedTaskTitle;
        task.taskDescription = taskDescription;
        task.taskDueDate = taskDueDate;

        return task.save();
    }

    // Delete a task
    async deleteTask(taskId: string): Promise<void> {
        const result = await this.taskEntityRepository.deleteOne({ _id: taskId });
        if (result.deletedCount === 0) {
            throw new NotFoundException('Task not found');
        }
    }

    // Retrieve a single task
    async getTask(taskId: string): Promise<TaskEntity> {
        const task = await this.taskEntityRepository.findById(taskId);
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return task;
    }

    // Retrieve all tasks in a project
    async getTasksByProject(projectId: string): Promise<TaskEntity[]> {
        return this.taskEntityRepository.find({ projectId });
    }

    // Retrieve tasks count for a user
    async getTasksCountForUser(userId: string): Promise<number> {
        return this.taskEntityRepository.countDocuments({ userId });
    }

}
