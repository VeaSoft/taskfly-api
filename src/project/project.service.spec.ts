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

  describe('getProjectsByProjectId', () => {
    it('should return a project by its ID', async () => {
      const mockProject = {
        _id: new Types.ObjectId(),
        projectName: 'Test Project',
        projectDescription: 'Test Description',
      };

      model.findOne = jest.fn().mockResolvedValue(mockProject);

      const result = await service.getProjectByProjectId('someId');

      expect(result).toEqual(mockProject);
      expect(model.findOne).toHaveBeenCalledWith({ _id: 'someId' });
    });

    it('should return null if project is not found', async () => {
      model.findOne = jest.fn().mockResolvedValue(null);

      const result = await service.getProjectByProjectId('someNonExistentId');

      expect(result).toBeNull();
      expect(model.findOne).toHaveBeenCalledWith({ _id: 'someNonExistentId' });
    });
  })


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
