import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('TaskController', () => {
  let taskController: TaskController;
  let taskService: TaskService;

  let userObjectId =  new Types.ObjectId();
  let projectObjectId = new Types.ObjectId();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService,{
        provide: getModelToken(TaskEntity.name),
        useValue: {
          findOne: jest.fn(),
          findById: jest.fn(),
          create: jest.fn(),
          deleteOne: jest.fn(),
          find: jest.fn(),
          countDocuments: jest.fn(),
        },
      },],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        taskTitle: 'Sample Task',
        taskDescription: 'Sample Description',
        taskDueDate: new Date(),
        projectId: projectObjectId.toHexString(),
      };

      const result: TaskEntity = {
        _id: new Types.ObjectId(),
        ...createTaskDto,
        projectId: projectObjectId,
        userId: new Types.ObjectId(),
      };

      jest.spyOn(taskService, 'createTask').mockResolvedValue(result);

      const task = await taskController.createTask(createTaskDto, { user: { userId: userObjectId.toHexString() } } as any);
      expect(task).toEqual(result);
    });

    it('should handle conflict if task title already exists', async () => {
      const createTaskDto: CreateTaskDto = {
        taskTitle: 'Sample Task',
        taskDescription: 'Sample Description',
        taskDueDate: new Date(),
        projectId: projectObjectId.toHexString(),
      };

      jest.spyOn(taskService, 'createTask').mockRejectedValue(new ConflictException());

      await expect(taskController.createTask(createTaskDto, { user: { userId: userObjectId.toHexString() } } as any)).rejects.toThrow(ConflictException);
    });

    // Add more test cases for other scenarios like missing fields, etc.
  });

  describe('updateTask', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        taskTitle: 'Updated Task Title',
        taskDescription: 'Updated Description',
        taskDueDate: new Date(),
      };

      const result: TaskEntity = {
        _id: new Types.ObjectId(),
        projectId: projectObjectId,
        ...updateTaskDto,
        userId: new Types.ObjectId(),
      };

      jest.spyOn(taskService, 'updateTask').mockResolvedValue(result);

      const task = await taskController.updateTask('1', updateTaskDto);
      expect(task).toEqual(result);
    });

    it('should handle not found exception if task does not exist', async () => {
      jest.spyOn(taskService, 'updateTask').mockRejectedValue(new NotFoundException());

      await expect(taskController.updateTask('1', {} as UpdateTaskDto)).rejects.toThrow(NotFoundException);
    });

  
  });


  describe('deleteTask', () => {
    it('should delete a task', async () => {
      jest.spyOn(taskService, 'deleteTask').mockResolvedValue(undefined);
      await expect(taskController.deleteTask('1')).resolves.toBeUndefined();
    });

    it('should handle not found exception if task does not exist', async () => {
      jest.spyOn(taskService, 'deleteTask').mockRejectedValue(new NotFoundException());
      await expect(taskController.deleteTask('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTask', () => {
    it('should retrieve a task', async () => {
      const taskEntity: TaskEntity = {
        _id: new Types.ObjectId(),
        taskTitle: 'Sample Task',
        taskDescription: 'Sample Description',
        taskDueDate: new Date(),
        projectId: projectObjectId,
        userId: userObjectId,
      };
      jest.spyOn(taskService, 'getTask').mockResolvedValue(taskEntity);
      const task = await taskController.getTask('1');
      expect(task).toEqual(taskEntity);
    });

    it('should handle not found exception if task does not exist', async () => {
      jest.spyOn(taskService, 'getTask').mockRejectedValue(new NotFoundException());
      await expect(taskController.getTask('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTasksByProject', () => {
    it('should retrieve tasks by project', async () => {
      const tasks: TaskEntity[] = [
        {
          _id: new Types.ObjectId(),
          taskTitle: 'Sample Task 1',
          taskDescription: 'Sample Description',
          taskDueDate: new Date(),
          projectId: projectObjectId,
          userId: userObjectId,
        },
        {
          _id: new Types.ObjectId(),
          taskTitle: 'Sample Task 2',
          taskDescription: 'Sample Description 2',
          taskDueDate: new Date(),
          projectId: projectObjectId,
          userId: userObjectId,
        }
        // Add more task entities as needed
      ];
      jest.spyOn(taskService, 'getTasksByProject').mockResolvedValue(tasks);
      const retrievedTasks = await taskController.getTasksByProject('project123');
      expect(retrievedTasks).toEqual(tasks);
    });
  });

  describe('getTasksCountForUser', () => {
    it('should retrieve task count for a user', async () => {
      const count = 5;
      jest.spyOn(taskService, 'getTasksCountForUser').mockResolvedValue(count);
      const taskCount = await taskController.getTasksCountForUser({ user: { userId: userObjectId.toHexString() } } as any);
      expect(taskCount).toBe(count);
    });
  });



});

