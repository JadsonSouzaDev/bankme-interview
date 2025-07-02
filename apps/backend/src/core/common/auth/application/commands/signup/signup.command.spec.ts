import { BadRequestException } from '@nestjs/common';
import { SignupCommand } from './signup.command';
import { UserRepository } from '../../../domain/user.repository';
import { ApplicationService } from '../../../../../common/application/application-service.interface';
import { User } from '../../../domain/user.aggregate';
import { AuthService } from '../../../infra/encrypt/auth.service';

describe('SignupCommand', () => {
  let command: SignupCommand;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockApplicationService: jest.Mocked<ApplicationService>;

  const validInput = {
    login: 'testuser',
    password: 'testpassword',
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
      encrypt: jest.fn(),
      signIn: jest.fn(),
    };

    mockApplicationService = {
      execute: jest.fn(),
    };

    command = new SignupCommand(
      mockUserRepository,
      mockAuthService,
      mockApplicationService,
    );
  });

  describe('execute', () => {
    it('should create user successfully when login is unique', async () => {
      // Arrange
      const mockUser = User.create(validInput);
      const expectedDto = mockUser.toDto();

      mockUserRepository.findByLogin.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await command.execute(validInput);

      // Assert
      expect(result).toEqual(expectedDto);
      expect(mockUserRepository.findByLogin).toHaveBeenCalledWith(
        validInput.login,
      );
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
      expect(mockApplicationService.execute).toHaveBeenCalled();
    });

    it('should throw BadRequestException when login already exists', async () => {
      // Arrange
      const existingUser = User.create(validInput);
      mockUserRepository.findByLogin.mockResolvedValue(existingUser);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act & Assert
      await expect(command.execute(validInput)).rejects.toThrow(
        BadRequestException,
      );
      await expect(command.execute(validInput)).rejects.toThrow(
        'User already exists',
      );

      expect(mockUserRepository.findByLogin).toHaveBeenCalledWith(
        validInput.login,
      );
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should hash password before saving', async () => {
      // Arrange
      const mockUser = User.create(validInput);
      mockUserRepository.findByLogin.mockResolvedValue(null);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await command.execute(validInput);

      // Assert
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: expect.not.stringMatching(validInput.password),
        }),
      );
    });

    it('should handle application service errors', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      mockApplicationService.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(command.execute(validInput)).rejects.toThrow(error);
    });
  });
});
