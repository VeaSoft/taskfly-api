import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import { Request } from 'express';
import { getModelToken } from '@nestjs/mongoose';
import { ProjectEntity } from './entities/project.entity';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('ProjectController', () => {
  let controller: ProjectController;
  let projectService: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [ProjectService, {
        provide: getModelToken(ProjectEntity.name),
        useValue: {
          find: jest.fn(),
          findOne: jest.fn(),
          create: jest.fn(),
        },
      },],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
    projectService = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProjectsBelongingToUser', () => {
    it('should return projects belonging to user', async () => {
      const userId = 'user123';
      const projects = []; // Mock the projects array
      jest.spyOn(projectService, 'getProjectsBelongingToUser').mockResolvedValue(projects as any);

      const req = {
        user: { userId },
      } as Request;

      const result = await controller.getProjectsBelongingToUser(req);

      // console.log(`Results ${JSON.stringify(result)}`);
      // console.log(`Received ${JSON.stringify(projects)}`)
      expect(result.data).toEqual(projects);
    });
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      const createProjectDto: CreateProjectDto = {
        projectName: 'project123',
        projectDescription: 'Description',
      };
      const userId = 'user123';
      const project = {}; // Mock the created project object
      jest.spyOn(projectService, 'createProject').mockResolvedValue(project as any);

      const req = {
        user: { userId },
      } as Request;

      const result = await controller.createProject(createProjectDto, req);

      expect(result.data).toEqual(project);
    });
  });

  describe('getProjectByProjectId', () => {
    it('should return the project if found', async () => {
      const projectId =  new Types.ObjectId();
      const mockProject = {
        _id: projectId,
        projectName: 'Test Project',
        projectDescription: 'Test Description',
      };
      jest.spyOn(projectService, 'getProjectByProjectId').mockResolvedValueOnce(mockProject as any);

      const result = await controller.getProjectByProjectId(projectId.toHexString());
      expect(result).toEqual({
        data: mockProject,
        message: 'successfully retrieved project',
      });
    });
  });
});
