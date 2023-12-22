import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { UserEntityDocument } from './entities/user.entity';
import { ObjectId, Types } from 'mongoose';


describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            createUserIfNotExist: jest.fn(),
            getJwtForUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('googleAuthRedirect', () => {
    it('should handle Google Sign-In callback and return user record and access token', async () => {
      const mockUser = { _id: 'user123', email: 'test@example.com', firstName: 'John', lastName: 'Doe' };
      const mockAccessToken = 'mockToken';

      const req = {
        user: mockUser,
      } as unknown as Request;

      jest.spyOn(authService, 'createUserIfNotExist').mockResolvedValueOnce(mockUser as any);
      jest.spyOn(authService, 'getJwtForUser').mockResolvedValueOnce(mockAccessToken);

      const result = await controller.googleAuthRedirect(req);

      expect(authService.createUserIfNotExist).toHaveBeenCalledWith(mockUser.email, mockUser.firstName, mockUser.lastName);
      expect(authService.getJwtForUser).toHaveBeenCalledWith(mockUser._id.toString());
      expect(result).toEqual({
        userRecord: mockUser,
        accessToken: mockAccessToken,
      });
    });
  });
});