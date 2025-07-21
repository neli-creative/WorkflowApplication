import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { RefreshToken } from './schemas/refresh-token.schema';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { Role } from './enums/role.enum';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

describe('AuthService', () => {
  let service: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userModel: Model<User>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let refreshTokenModel: Model<RefreshToken>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;

  const mockUserModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const mockRefreshTokenModel = {
    findOne: jest.fn(),
    updateOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: getModelToken(RefreshToken.name),
          useValue: mockRefreshTokenModel,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    refreshTokenModel = module.get<Model<RefreshToken>>(
      getModelToken(RefreshToken.name),
    );
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    const signupData: SignupDto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      role: Role.USER,
    };

    it('should create a new user successfully', async () => {
      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({});
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      await service.signUp(signupData);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: signupData.email,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(signupData.password, 12);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        email: signupData.email,
        password: 'hashedPassword',
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        role: 'user',
      });
    });

    it('should throw BadRequestException if email is already in use', async () => {
      mockUserModel.findOne.mockResolvedValue({ email: signupData.email });

      await expect(service.signUp(signupData)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.signUp(signupData)).rejects.toThrow(
        'Email already in use',
      );
      expect(mockUserModel.create).not.toHaveBeenCalled();
    });

    it('should use default role USER if not provided', async () => {
      const signupWithoutRole = { ...signupData };
      delete signupWithoutRole.role;

      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue({});
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      await service.signUp(signupWithoutRole);

      expect(mockUserModel.create).toHaveBeenCalledWith({
        email: signupData.email,
        password: 'hashedPassword',
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        role: 'user',
      });
    });
  });

  describe('login', () => {
    const loginData: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      _id: { toString: () => 'user-id' },
      email: 'test@example.com',
      password: 'hashedPassword',
      firstName: 'John',
      lastName: 'Doe',
      role: Role.USER,
    };

    it('should login successfully with valid credentials', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('mock-access-token');
      mockRefreshTokenModel.updateOne.mockResolvedValue({});

      const result = await service.login(loginData);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        email: loginData.email,
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        mockUser.password,
      );
      expect(result).toEqual({
        access_token: 'mock-access-token',
        refreshToken: 'mock-uuid',
        userId: 'user-id',
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(service.login(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginData)).rejects.toThrow(
        'Invalid email or password',
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUserModel.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginData)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginData)).rejects.toThrow(
        'Invalid email or password',
      );
    });
  });

  describe('refreshTokens', () => {
    const mockToken = 'valid-refresh-token';
    const mockRefreshTokenDoc = {
      token: mockToken,
      userId: 'user-id',
      expiresAt: new Date(Date.now() + 86400000),
    };

    const mockUser = {
      _id: 'user-id',
      role: Role.USER,
    };

    it('should refresh tokens successfully with valid refresh token', async () => {
      mockRefreshTokenModel.findOne.mockResolvedValue(mockRefreshTokenDoc);
      mockUserModel.findById.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('new-access-token');
      mockRefreshTokenModel.updateOne.mockResolvedValue({});

      const result = await service.refreshTokens(mockToken);

      expect(mockRefreshTokenModel.findOne).toHaveBeenCalledWith({
        token: mockToken,
        expiresAt: { $gte: expect.any(Date) as Date },
      });
      expect(mockUserModel.findById).toHaveBeenCalledWith(
        mockRefreshTokenDoc.userId,
      );
      expect(result).toEqual({
        access_token: 'new-access-token',
        refreshToken: 'mock-uuid',
      });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockRefreshTokenModel.findOne.mockResolvedValue(null);

      await expect(service.refreshTokens('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refreshTokens('invalid-token')).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockRefreshTokenModel.findOne.mockResolvedValue(mockRefreshTokenDoc);
      mockUserModel.findById.mockResolvedValue(null);

      await expect(service.refreshTokens(mockToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refreshTokens(mockToken)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('storeRefreshToken', () => {
    it('should store refresh token with correct expiration', async () => {
      mockRefreshTokenModel.updateOne.mockResolvedValue({});

      await service.storeRefreshToken('token', 'user-id');

      expect(mockRefreshTokenModel.updateOne).toHaveBeenCalledWith(
        { userId: 'user-id' },
        {
          $set: {
            expiresAt: expect.any(Date) as Date,
            token: 'token',
          },
        },
        { upsert: true },
      );
    });
  });

  describe('findUserById', () => {
    it('should find user by id', async () => {
      const mockUser = { _id: 'user-id', email: 'test@example.com' };
      mockUserModel.findById.mockResolvedValue(mockUser);

      const result = await service.findUserById('user-id');

      expect(mockUserModel.findById).toHaveBeenCalledWith('user-id');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockUserModel.findById.mockResolvedValue(null);

      const result = await service.findUserById('non-existent-id');

      expect(result).toBeNull();
    });
  });
});
