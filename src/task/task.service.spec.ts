import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getModelToken } from '@nestjs/mongoose';
import { TaskEntity, TaskEntityDocument } from './entities/task.entity';
import { Model, Types } from 'mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let mockTaskModel: Model<TaskEntityDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getModelToken(TaskEntity.name),
          useValue: {
            findOne: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            find: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    mockTaskModel = module.get<Model<TaskEntityDocument>>(getModelToken(TaskEntity.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const mockTask = {
        taskTitle: 'Task Title',
        taskDescription: 'Task Description',
        taskDueDate: new Date(),
        projectId: new Types.ObjectId(),
        userId: new Types.ObjectId(),
      };
      jest.spyOn(mockTaskModel, 'create').mockResolvedValueOnce(mockTask as any);

      const result = await service.createTask(mockTask.taskTitle, mockTask.taskDescription, mockTask.taskDueDate, mockTask.projectId.toHexString(), mockTask.userId.toHexString());
      expect(result).toEqual(mockTask);
    });

    it('should throw a ConflictException if task with the same title exists', async () => {
      jest.spyOn(mockTaskModel, 'findOne').mockResolvedValue({ taskTitle: 'Task Title' } as any);
      await expect(service.createTask('Task Title', 'Description', new Date(), 'projectId', 'userId')).rejects.toThrow(ConflictException);
    });

  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const id = new Types.ObjectId();
      const mockTask: TaskEntity = {
        _id: id,
        taskTitle: 'Updated Task Title',
        taskDescription: 'Updated Task Description',
        taskDueDate: new Date(),
        projectId: 'projectId',
        userId: 'userId',
        save: jest.fn().mockResolvedValue({_id: id, taskTitle: 'Updated Task Title', taskDescription: 'Updated Task Description' }),
      } as any;

      jest.spyOn(mockTaskModel, 'findById').mockResolvedValue(mockTask);
      const result = await service.updateTask('someId', 'Updated Task Title', 'Updated Task Description', new Date());
      expect(result.taskTitle).toEqual('Updated Task Title');
    });

    it('should throw a NotFoundException if task is not found', async () => {
      jest.spyOn(mockTaskModel, 'findById').mockResolvedValue(null);
      await expect(service.updateTask('someId', 'Task Title', 'Description', new Date())).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      jest.spyOn(mockTaskModel, 'deleteOne').mockResolvedValue({ deletedCount: 1 } as any);
      await expect(service.deleteTask('someId')).resolves.not.toThrow();
    });

    it('should throw a NotFoundException if task is not found during deletion', async () => {
      jest.spyOn(mockTaskModel, 'deleteOne').mockResolvedValue({ deletedCount: 0 } as any);
      await expect(service.deleteTask('someId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTask', () => {
    it('should retrieve a task by ID', async () => {
      const mockTask = {
        taskTitle: 'Task Title',
        taskDescription: 'Task Description',
        taskDueDate: new Date(),
        projectId: new Types.ObjectId(),
        userId: new Types.ObjectId(),
      };
      jest.spyOn(mockTaskModel, 'findById').mockResolvedValue(mockTask);
      const result = await service.getTask('someId');
      expect(result).toEqual(mockTask);
    });

    it('should throw a NotFoundException if task is not found', async () => {
      jest.spyOn(mockTaskModel, 'findById').mockResolvedValue(null);
      await expect(service.getTask('someId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTasksByProject', () => {
    it('should retrieve tasks by project ID', async () => {
      const projectId = new Types.ObjectId();
      const mockTasks: TaskEntity[] = [
        {
          _id: new Types.ObjectId(),
          taskTitle: 'Task 1',
          taskDescription: 'Description 1',
          taskDueDate: new Date(),
          projectId: projectId,
          userId: new Types.ObjectId(),
        },
        {
          _id: new Types.ObjectId(),
          taskTitle: 'Task 2',
          taskDescription: 'Description 2',
          taskDueDate: new Date(),
          projectId: projectId,
          userId: new Types.ObjectId(),
        },
        // ... other mock tasks
      ];
      jest.spyOn(mockTaskModel, 'find').mockResolvedValue(mockTasks);
      const result = await service.getTasksByProject('projectId');
      expect(result).toEqual(mockTasks);
    });
  });

  describe('getTasksCountForUser', () => {
    it('should retrieve the count of tasks for a user', async () => {
      jest.spyOn(mockTaskModel, 'countDocuments').mockResolvedValue(5);
      const result = await service.getTasksCountForUser('userId');
      expect(result).toEqual(5);
    });
  });

});
