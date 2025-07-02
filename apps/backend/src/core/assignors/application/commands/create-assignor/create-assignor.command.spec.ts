import { BadRequestException } from '@nestjs/common';
import { CreateAssignorCommand } from './create-assignor.command';
import { AssignorRepository } from '../../../domain/assignor.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { Assignor } from '../../../domain/assignor.aggregate';

describe('CreateAssignorCommand', () => {
  let command: CreateAssignorCommand;
  let mockAssignorRepository: jest.Mocked<AssignorRepository>;
  let mockApplicationService: jest.Mocked<ApplicationService>;

  const validInput = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    document: '12345678901',
    phone: '11987654321',
  };

  beforeEach(() => {
    mockAssignorRepository = {
      findByEmail: jest.fn(),
      findByDocument: jest.fn(),
      save: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      setEventPublisher: jest.fn(),
    };

    mockApplicationService = {
      execute: jest.fn(),
    };

    command = new CreateAssignorCommand(
      mockAssignorRepository,
      mockApplicationService,
    );
  });

  describe('execute', () => {
    it('should create assignor successfully when email and document are unique', async () => {
      // Arrange
      const mockAssignor = Assignor.create(validInput);
      const expectedDto = mockAssignor.toDto();

      mockAssignorRepository.findByEmail.mockResolvedValue(null);
      mockAssignorRepository.findByDocument.mockResolvedValue(null);
      mockAssignorRepository.save.mockResolvedValue(mockAssignor);
      mockApplicationService.execute.mockImplementation(async (fn) => await fn());

      // Act
      const result = await command.execute(validInput);

      // Assert
      expect(result).toEqual(expectedDto);
      expect(mockAssignorRepository.findByEmail).toHaveBeenCalledWith(
        validInput.email,
      );
      expect(mockAssignorRepository.findByDocument).toHaveBeenCalledWith(
        validInput.document,
      );
      expect(mockAssignorRepository.save).toHaveBeenCalledWith(
        expect.any(Assignor),
      );
      expect(mockApplicationService.execute).toHaveBeenCalled();
    });

    it('should throw BadRequestException when email already exists', async () => {
      // Arrange
      const existingAssignor = Assignor.create(validInput);
      mockAssignorRepository.findByEmail.mockResolvedValue(existingAssignor);
      mockApplicationService.execute.mockImplementation(async (fn) => await fn());

      // Act & Assert
      await expect(command.execute(validInput)).rejects.toThrow(
        BadRequestException,
      );
      await expect(command.execute(validInput)).rejects.toThrow(
        'Email already in use',
      );

      expect(mockAssignorRepository.findByEmail).toHaveBeenCalledWith(
        validInput.email,
      );
      expect(mockAssignorRepository.findByDocument).not.toHaveBeenCalled();
      expect(mockAssignorRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when document already exists', async () => {
      // Arrange
      const existingAssignor = Assignor.create(validInput);
      mockAssignorRepository.findByEmail.mockResolvedValue(null);
      mockAssignorRepository.findByDocument.mockResolvedValue(existingAssignor);
      mockApplicationService.execute.mockImplementation(async (fn) => await fn());

      // Act & Assert
      await expect(command.execute(validInput)).rejects.toThrow(
        BadRequestException,
      );
      await expect(command.execute(validInput)).rejects.toThrow(
        'Document already in use',
      );

      expect(mockAssignorRepository.findByEmail).toHaveBeenCalledWith(
        validInput.email,
      );
      expect(mockAssignorRepository.findByDocument).toHaveBeenCalledWith(
        validInput.document,
      );
      expect(mockAssignorRepository.save).not.toHaveBeenCalled();
    });

    it('should check email before document when both exist', async () => {
      // Arrange
      const existingAssignor = Assignor.create(validInput);
      mockAssignorRepository.findByEmail.mockResolvedValue(existingAssignor);
      mockApplicationService.execute.mockImplementation(async (fn) => await fn());

      // Act & Assert
      await expect(command.execute(validInput)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockAssignorRepository.findByEmail).toHaveBeenCalledWith(
        validInput.email,
      );
      expect(mockAssignorRepository.findByDocument).not.toHaveBeenCalled();
    });

    it('should create assignor with trimmed and normalized data', async () => {
      // Arrange
      const inputWithWhitespace = {
        name: '  John Doe  ',
        email: '  JOHN.DOE@EXAMPLE.COM  ',
        document: '  12345678901  ',
        phone: '  11987654321  ',
      };

      const mockAssignor = Assignor.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        document: '12345678901',
        phone: '11987654321',
      });

      mockAssignorRepository.findByEmail.mockResolvedValue(null);
      mockAssignorRepository.findByDocument.mockResolvedValue(null);
      mockAssignorRepository.save.mockResolvedValue(mockAssignor);
      mockApplicationService.execute.mockImplementation(async (fn) => await fn());

      // Act
      await command.execute(inputWithWhitespace);

      // Assert
      expect(mockAssignorRepository.findByEmail).toHaveBeenCalledWith(
        '  JOHN.DOE@EXAMPLE.COM  ',
      );
      expect(mockAssignorRepository.findByDocument).toHaveBeenCalledWith(
        '  12345678901  ',
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