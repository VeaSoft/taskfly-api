import { Test, TestingModule } from '@nestjs/testing';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dtos/create-project.dto';
import { Request } from 'express';
import { getModelToken } from '@nestjs/mongoose';
import { ProjectEntity } from './entities/project.entity';

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
      jest.spyOn(projectService, 'getProjectsBelongingToUser').mockResolvedValue(projects);

      const req = {
        user: { userId },
      } as Request;

      const result = await controller.getProjectsBelongingToUser(req);

      expect(result).toEqual(projects);
    });
  });

  describe('getProjectByProjectName', () => {
    it('should return project by project name', async () => {
      const projectName = 'project123';
      const project = {}; // Mock the project object
      jest.spyOn(projectService, 'getProjectByProjectName').mockResolvedValue(project as any);

      const result = await controller.getProjectByProjectName(projectName);

      expect(result).toEqual(project);
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

      expect(result).toEqual(project);
    });
  });
});
