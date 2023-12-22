import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserEntity } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<UserEntity>;

  beforeEach(async () => {
    const mockUserModel = {
      findOneAndUpdate: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(UserEntity.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'mockToken'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<UserEntity>>(getModelToken(UserEntity.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUserIfNotExist', () => {
    it('should create a new user if not exist', async () => {
      const email = 'test@example.com';
      const firstName = 'John';
      const lastName = 'Doe';
      const mockUser = { email, firstName, lastName };

      jest.spyOn(userModel, 'findOneAndUpdate').mockResolvedValueOnce(mockUser as any);

      const result = await service.createUserIfNotExist(email, firstName, lastName);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUserByEmail', () => {
    it('should get user by email', async () => {
      const email = 'test@example.com';
      const mockUser = { email, firstName: 'John', lastName: 'Doe' };

      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockUser as any);

      const result = await service.getUserByEmail(email);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getJwtForUser', () => {
    it('should return JWT for user', async () => {
      const userId = 'user123';
      const mockToken = 'mockToken';

      const result = await service.getJwtForUser(userId);
      expect(result).toEqual(mockToken);
    });
  });
});
