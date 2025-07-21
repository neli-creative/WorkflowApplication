import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokensDto } from './dtos/refresh-tokens.dto';
import { Role } from './enums/role.enum';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signUp: jest.fn(),
    login: jest.fn(),
    refreshTokens: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should call authService.signUp with correct data', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe',
        role: Role.USER,
      };

      mockAuthService.signUp.mockResolvedValue(undefined);

      await controller.signUp(signupDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.signUp).toHaveBeenCalledWith(signupDto);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.signUp).toHaveBeenCalledTimes(1);
    });

    it('should return the result from authService.signUp', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'Password123',
        firstName: 'John',
        lastName: 'Doe',
        role: Role.USER,
      };

      mockAuthService.signUp.mockResolvedValue(undefined);

      const result = await controller.signUp(signupDto);

      expect(result).toBeUndefined();
    });
  });

  describe('login', () => {
    it('should call authService.login with correct credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const mockLoginResult = {
        access_token: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        userId: 'user-id',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: Role.USER,
      };

      mockAuthService.login.mockResolvedValue(mockLoginResult);

      const result = await controller.login(loginDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockLoginResult);
    });
  });

  describe('refreshTokens', () => {
    it('should call authService.refreshTokens with correct token', async () => {
      const refreshTokensDto: RefreshTokensDto = {
        token: 'mock-refresh-token',
      };

      const mockRefreshResult = {
        access_token: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockAuthService.refreshTokens.mockResolvedValue(mockRefreshResult);

      const result = await controller.refreshTokens(refreshTokensDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.refreshTokens).toHaveBeenCalledWith(
        refreshTokensDto.token,
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(authService.refreshTokens).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockRefreshResult);
    });
  });
});
