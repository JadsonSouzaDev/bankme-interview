import { NotFoundException } from '@nestjs/common';
import { LoginCommand } from './login.command';
import { UserRepository } from '../../../domain/user.repository';
import { ApplicationService } from '../../../../../common/application/application-service.interface';
import { AuthService } from '../../../infra/encrypt/auth.service';
import { User } from '../../../domain/user.aggregate';
import { TokenDto } from '@bankme/shared';

describe('LoginCommand', () => {
  let command: LoginCommand;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockApplicationService: jest.Mocked<ApplicationService>;

  const validInput = {
    login: 'testuser',
    password: 'testpassword',
  };

  const mockUser = User.create({
    login: 'testuser',
    password: 'hashedpassword',
  });

  const mockTokenDto: TokenDto = {
    accessToken: 'jwt-token-here',
    expiresIn: 60,
  };

  beforeEach(() => {
    mockUserRepository = {
      findByLogin: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
      setEventPublisher: jest.fn(),
    };

    mockAuthService = {
      signIn: jest.fn(),
      encrypt: jest.fn(),
    };

    mockApplicationService = {
      execute: jest.fn(),
    };

    command = new LoginCommand(
      mockUserRepository,
      mockAuthService,
      mockApplicationService,
    );
  });

  describe('execute', () => {
    it('should return token when user exists and password is valid', async () => {
      // Arrange
      mockUserRepository.findByLogin.mockResolvedValue(mockUser);
      mockAuthService.signIn.mockResolvedValue(mockTokenDto);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await command.execute(validInput);

      // Assert
      expect(result).toEqual(mockTokenDto);
      expect(mockUserRepository.findByLogin).toHaveBeenCalledWith(
        validInput.login,
      );
      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        mockUser,
        validInput.password,
      );
      expect(mockApplicationService.execute).toHaveBeenCalled();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      // Arrange
      mockUserRepository.findByLogin.mockResolvedValue(null);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act & Assert
      await expect(command.execute(validInput)).rejects.toThrow(
        NotFoundException,
      );
      await expect(command.execute(validInput)).rejects.toThrow(
        'User not found',
      );

      expect(mockUserRepository.findByLogin).toHaveBeenCalledWith(
        validInput.login,
      );
      expect(mockAuthService.signIn).not.toHaveBeenCalled();
    });

    it('should propagate auth service errors', async () => {
      // Arrange
      const authError = new Error('Invalid password');
      mockUserRepository.findByLogin.mockResolvedValue(mockUser);
      mockAuthService.signIn.mockRejectedValue(authError);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act & Assert
      await expect(command.execute(validInput)).rejects.toThrow(authError);

      expect(mockUserRepository.findByLogin).toHaveBeenCalledWith(
        validInput.login,
      );
      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        mockUser,
        validInput.password,
      );
    });

    it('should handle application service errors', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      mockApplicationService.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(command.execute(validInput)).rejects.toThrow(error);
    });

    it('should call findByLogin with correct login parameter', async () => {
      // Arrange
      const customInput = {
        login: 'customuser',
        password: 'custompassword',
      };

      mockUserRepository.findByLogin.mockResolvedValue(mockUser);
      mockAuthService.signIn.mockResolvedValue(mockTokenDto);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await command.execute(customInput);

      // Assert
      expect(mockUserRepository.findByLogin).toHaveBeenCalledWith(
        customInput.login,
      );
    });

    it('should pass user and password to auth service', async () => {
      // Arrange
      const customUser = User.create({
        login: 'anotheruser',
        password: 'anotherhashedpassword',
      });

      mockUserRepository.findByLogin.mockResolvedValue(customUser);
      mockAuthService.signIn.mockResolvedValue(mockTokenDto);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await command.execute(validInput);

      // Assert
      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        customUser,
        validInput.password,
      );
    });

    it('should return the exact token from auth service', async () => {
      // Arrange
      const customTokenDto: TokenDto = {
        accessToken: 'custom-jwt-token',
        expiresIn: 120,
      };

      mockUserRepository.findByLogin.mockResolvedValue(mockUser);
      mockAuthService.signIn.mockResolvedValue(customTokenDto);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await command.execute(validInput);

      // Assert
      expect(result).toEqual(customTokenDto);
      expect(result.accessToken).toBe('custom-jwt-token');
      expect(result.expiresIn).toBe(120);
    });
  });
});
