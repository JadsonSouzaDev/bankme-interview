import { NotFoundException } from '@nestjs/common';
import { GetAssignorQuery } from './get-assignor.query';
import { AssignorRepository } from '../../../domain/assignor.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { Assignor } from '../../../domain/assignor.aggregate';

describe('GetAssignorQuery', () => {
  let query: GetAssignorQuery;
  let mockAssignorRepository: jest.Mocked<AssignorRepository>;
  let mockApplicationService: jest.Mocked<ApplicationService>;

  const existingAssignor = Assignor.create({
    name: 'John Doe',
    email: 'john.doe@example.com',
    document: '12345678901',
    phone: '11987654321',
  });

  const validInput = {
    id: existingAssignor.id,
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

    query = new GetAssignorQuery(
      mockAssignorRepository,
      mockApplicationService,
    );
  });

  describe('execute', () => {
    it('should return assignor DTO when assignor exists', async () => {
      // Arrange
      const expectedDto = existingAssignor.toDto();

      mockAssignorRepository.findById.mockResolvedValue(existingAssignor);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await query.execute(validInput);

      // Assert
      expect(result).toEqual(expectedDto);
      expect(mockAssignorRepository.findById).toHaveBeenCalledWith(
        validInput.id,
      );
      expect(mockApplicationService.execute).toHaveBeenCalled();
    });

    it('should throw NotFoundException when assignor does not exist', async () => {
      // Arrange
      mockAssignorRepository.findById.mockResolvedValue(null);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act & Assert
      await expect(query.execute(validInput)).rejects.toThrow(
        NotFoundException,
      );
      await expect(query.execute(validInput)).rejects.toThrow(
        'Assignor not found',
      );

      expect(mockAssignorRepository.findById).toHaveBeenCalledWith(
        validInput.id,
      );
    });

    it('should handle application service errors', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      mockApplicationService.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(query.execute(validInput)).rejects.toThrow(error);
    });

    it('should return correct DTO structure', async () => {
      // Arrange
      mockAssignorRepository.findById.mockResolvedValue(existingAssignor);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await query.execute(validInput);

      // Assert
      expect(result).toHaveProperty('id', existingAssignor.id);
      expect(result).toHaveProperty('name', existingAssignor.name);
      expect(result).toHaveProperty('email', existingAssignor.email);
      expect(result).toHaveProperty('document', existingAssignor.document);
      expect(result).toHaveProperty('phone', existingAssignor.phone);
    });
  });
});
