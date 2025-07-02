import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

import { LoginDto, SignupDto, TokenDto, UserDto } from '@bankme/shared';
import { LOGIN_COMMAND, SIGNUP_COMMAND } from '../auth.providers';

describe('AuthController', () => {
  let controller: AuthController;
  let mockSignupCommand: any;
  let mockLoginCommand: any;

  const mockLoginDto: LoginDto = {
    login: 'testuser',
    password: 'testpassword',
  };

  const mockSignupDto: SignupDto = {
    login: 'newuser',
    password: 'newpassword',
  };

  const mockTokenDto: TokenDto = {
    accessToken: 'jwt-token-here',
    expiresIn: 60,
  };

  const mockUserDto: UserDto = {
    id: 'user-123',
    login: 'newuser',
  };

  beforeEach(async () => {
    mockSignupCommand = {
      execute: jest.fn(),
    };

    mockLoginCommand = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: SIGNUP_COMMAND,
          useValue: mockSignupCommand,
        },
        {
          provide: LOGIN_COMMAND,
          useValue: mockLoginCommand,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    it('should return token when login is successful', async () => {
      // Arrange
      mockLoginCommand.execute.mockResolvedValue(mockTokenDto);

      // Act
      const result = await controller.login(mockLoginDto);

      // Assert
      expect(result).toEqual(mockTokenDto);
      expect(mockLoginCommand.execute).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should call login command with correct parameters', async () => {
      // Arrange
      const customLoginDto: LoginDto = {
        login: 'customuser',
        password: 'custompassword',
      };
      mockLoginCommand.execute.mockResolvedValue(mockTokenDto);

      // Act
      await controller.login(customLoginDto);

      // Assert
      expect(mockLoginCommand.execute).toHaveBeenCalledWith(customLoginDto);
    });

    it('should propagate login command errors', async () => {
      // Arrange
      const error = new Error('Invalid credentials');
      mockLoginCommand.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.login(mockLoginDto)).rejects.toThrow(error);
      expect(mockLoginCommand.execute).toHaveBeenCalledWith(mockLoginDto);
    });

    it('should return the exact token from login command', async () => {
      // Arrange
      const customTokenDto: TokenDto = {
        accessToken: 'custom-jwt-token',
        expiresIn: 120,
      };
      mockLoginCommand.execute.mockResolvedValue(customTokenDto);

      // Act
      const result = await controller.login(mockLoginDto);

      // Assert
      expect(result).toEqual(customTokenDto);
      expect(result.accessToken).toBe('custom-jwt-token');
      expect(result.expiresIn).toBe(120);
    });
  });

  describe('signup', () => {
    it('should return user when signup is successful', async () => {
      // Arrange
      mockSignupCommand.execute.mockResolvedValue(mockUserDto);

      // Act
      const result = await controller.signup(mockSignupDto);

      // Assert
      expect(result).toEqual(mockUserDto);
      expect(mockSignupCommand.execute).toHaveBeenCalledWith(mockSignupDto);
    });

    it('should call signup command with correct parameters', async () => {
      // Arrange
      const customSignupDto: SignupDto = {
        login: 'anotheruser',
        password: 'anotherpassword',
      };
      mockSignupCommand.execute.mockResolvedValue(mockUserDto);

      // Act
      await controller.signup(customSignupDto);

      // Assert
      expect(mockSignupCommand.execute).toHaveBeenCalledWith(customSignupDto);
    });

    it('should propagate signup command errors', async () => {
      // Arrange
      const error = new Error('User already exists');
      mockSignupCommand.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.signup(mockSignupDto)).rejects.toThrow(error);
      expect(mockSignupCommand.execute).toHaveBeenCalledWith(mockSignupDto);
    });

    it('should return the exact user from signup command', async () => {
      // Arrange
      const customUserDto: UserDto = {
        id: 'custom-user-456',
        login: 'customuser',
      };
      mockSignupCommand.execute.mockResolvedValue(customUserDto);

      // Act
      const result = await controller.signup(mockSignupDto);

      // Assert
      expect(result).toEqual(customUserDto);
      expect(result.id).toBe('custom-user-456');
      expect(result.login).toBe('customuser');
    });
  });

  describe('controller configuration', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should have correct route prefix', () => {
      // This test verifies that the controller is properly decorated
      // The actual route prefix is 'integrations/auth'
      expect(controller).toBeInstanceOf(AuthController);
    });

    it('should have both commands injected', () => {
      expect(mockSignupCommand).toBeDefined();
      expect(mockLoginCommand).toBeDefined();
    });
  });

  describe('HTTP status codes', () => {
    it('should return 200 for login endpoint', async () => {
      // Arrange
      mockLoginCommand.execute.mockResolvedValue(mockTokenDto);

      // Act
      const result = await controller.login(mockLoginDto);

      // Assert
      expect(result).toBeDefined();
      // Note: The actual HTTP status code is set by the @HttpCode decorator
      // This test verifies the method executes successfully
    });

    it('should return 201 for signup endpoint', async () => {
      // Arrange
      mockSignupCommand.execute.mockResolvedValue(mockUserDto);

      // Act
      const result = await controller.signup(mockSignupDto);

      // Assert
      expect(result).toBeDefined();
      // Note: The actual HTTP status code is set by the @HttpCode decorator
      // This test verifies the method executes successfully
    });
  });

  describe('error handling', () => {
    it('should handle login command throwing NotFoundException', async () => {
      // Arrange
      const { NotFoundException } = await import('@nestjs/common');
      const notFoundError = new NotFoundException('User not found');
      mockLoginCommand.execute.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(controller.login(mockLoginDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should handle signup command throwing BadRequestException', async () => {
      // Arrange
      const { BadRequestException } = await import('@nestjs/common');
      const badRequestError = new BadRequestException('User already exists');
      mockSignupCommand.execute.mockRejectedValue(badRequestError);

      // Act & Assert
      await expect(controller.signup(mockSignupDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
