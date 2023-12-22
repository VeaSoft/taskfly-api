import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProjectEntity, ProjectEntityDocument } from './entities/project.entity';

describe('ProjectService', () => {
  let service: ProjectService;
  let model: Model<ProjectEntityDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getModelToken(ProjectEntity.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
    model = module.get<Model<ProjectEntityDocument>>(getModelToken(ProjectEntity.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProjectsBelongingToUser', () => {
    it('should return projects belonging to a user', async () => {
      const userId = new Types.ObjectId().toHexString();
      const expectedProjects = [{ userId, projectName: 'Project1', projectDescription: 'Description1' }];

      jest.spyOn(model, 'find').mockResolvedValueOnce(expectedProjects);

      const result = await service.getProjectsBelongingToUser(userId);

      expect(result).toEqual(expectedProjects);
      expect(model.find).toHaveBeenCalledWith({ userId });
    });
  });

  describe('getProjectByProjectName', () => {
    it('should return a project by project name', async () => {
      const projectName = 'Project1';
      const expectedProject = { userId: new Types.ObjectId().toHexString(), projectName, projectDescription: 'Description1' };

      jest.spyOn(model, 'findOne').mockResolvedValueOnce(expectedProject);

      const result = await service.getProjectByProjectName(projectName);

      expect(result).toEqual(expectedProject);
      expect(model.findOne).toHaveBeenCalledWith({ projectName: { $regex: new RegExp(projectName.trim(), 'i') } });
    });
  });

  describe('createProject', () => {
    it('should create a new project', async () => {
      const userId = new Types.ObjectId();
      const projectName = 'Project1';
      const projectDescription = 'Description1';

      const newProject: ProjectEntity = {
        userId: userId,
        projectName,
        projectDescription,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(model, 'create').mockResolvedValueOnce(newProject as any);

      const result = await service.createProject(userId.toHexString(), projectName, projectDescription);

      expect(result).toEqual(newProject);
    });
  });
});
