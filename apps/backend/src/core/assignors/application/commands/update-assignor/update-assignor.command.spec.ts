import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateAssignorCommand } from './update-assignor.command';
import { AssignorRepository } from '../../../domain/assignor.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { Assignor } from '../../../domain/assignor.aggregate';

describe('UpdateAssignorCommand', () => {
  let command: UpdateAssignorCommand;
  let mockAssignorRepository: jest.Mocked<AssignorRepository>;
  let mockApplicationService: jest.Mocked<ApplicationService>;

  const existingAssignor = Assignor.create({
    name: 'John Doe',
    email: 'john.doe@example.com',
    document: '12345678901',
    phone: '11987654321',
  });

  const validUpdateInput = {
    id: existingAssignor.id,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    document: '98765432109',
    phone: '11876543210',
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

    command = new UpdateAssignorCommand(
      mockAssignorRepository,
      mockApplicationService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should update assignor successfully when all fields are valid', async () => {
      // Arrange
      const updatedAssignor = Assignor.create({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        document: '98765432109',
        phone: '11876543210',
      });

      mockAssignorRepository.findById.mockResolvedValue(existingAssignor);
      mockAssignorRepository.findByEmail.mockResolvedValue(null);
      mockAssignorRepository.findByDocument.mockResolvedValue(null);
      mockAssignorRepository.save.mockResolvedValue(updatedAssignor);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await command.execute(validUpdateInput);

      // Assert
      expect(result).toEqual(updatedAssignor.toDto());
      expect(mockAssignorRepository.findById).toHaveBeenCalledWith(
        validUpdateInput.id,
      );
      expect(mockAssignorRepository.findByEmail).toHaveBeenCalledWith(
        validUpdateInput.email,
      );
      expect(mockAssignorRepository.findByDocument).toHaveBeenCalledWith(
        validUpdateInput.document,
      );
      expect(mockAssignorRepository.save).toHaveBeenCalledWith(
        expect.any(Assignor),
      );
    });

    it('should throw NotFoundException when assignor does not exist', async () => {
      // Arrange
      mockAssignorRepository.findById.mockResolvedValue(null);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act & Assert
      await expect(command.execute(validUpdateInput)).rejects.toThrow(
        NotFoundException,
      );
      await expect(command.execute(validUpdateInput)).rejects.toThrow(
        'Assignor not found',
      );

      expect(mockAssignorRepository.findById).toHaveBeenCalledWith(
        validUpdateInput.id,
      );
      expect(mockAssignorRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockAssignorRepository.findByDocument).not.toHaveBeenCalled();
      expect(mockAssignorRepository.save).not.toHaveBeenCalled();
    });

    it('should not check for duplicates when email is not changed', async () => {
      // Arrange
      const updateInput = {
        id: existingAssignor.id,
        name: 'Jane Doe',
        email: existingAssignor.email, // Same email
        phone: '11876543210',
      };

      const updatedAssignor = Assignor.create({
        name: 'Jane Doe',
        email: existingAssignor.email,
        document: existingAssignor.document,
        phone: '11876543210',
      });

      mockAssignorRepository.findById.mockResolvedValue(existingAssignor);
      mockAssignorRepository.save.mockResolvedValue(updatedAssignor);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await command.execute(updateInput);

      // Assert
      expect(mockAssignorRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockAssignorRepository.save).toHaveBeenCalled();
    });

    it('should not check for duplicates when document is not changed', async () => {
      // Arrange
      const updateInput = {
        id: existingAssignor.id,
        name: 'Jane Doe',
        document: existingAssignor.document, // Same document
        phone: '11876543210',
      };

      const updatedAssignor = Assignor.create({
        name: 'Jane Doe',
        email: existingAssignor.email,
        document: existingAssignor.document,
        phone: '11876543210',
      });

      mockAssignorRepository.findById.mockResolvedValue(existingAssignor);
      mockAssignorRepository.save.mockResolvedValue(updatedAssignor);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await command.execute(updateInput);

      // Assert
      expect(mockAssignorRepository.findByDocument).not.toHaveBeenCalled();
      expect(mockAssignorRepository.save).toHaveBeenCalled();
    });

    it('should allow updating to same email if it belongs to the same assignor', async () => {
      // Arrange
      const updateInput = {
        id: existingAssignor.id,
        name: 'Jane Doe',
        email: existingAssignor.email, // Same email
      };

      const updatedAssignor = Assignor.create({
        name: 'Jane Doe',
        email: existingAssignor.email,
        document: existingAssignor.document,
        phone: existingAssignor.phone,
      });

      mockAssignorRepository.findById.mockResolvedValue(existingAssignor);
      mockAssignorRepository.save.mockResolvedValue(updatedAssignor);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await command.execute(updateInput);

      // Assert
      expect(mockAssignorRepository.findByEmail).not.toHaveBeenCalled();
      expect(mockAssignorRepository.save).toHaveBeenCalled();
    });

    it('should allow updating to same document if it belongs to the same assignor', async () => {
      // Arrange
      const updateInput = {
        id: existingAssignor.id,
        name: 'Jane Doe',
        document: existingAssignor.document, // Same document
      };

      const updatedAssignor = Assignor.create({
        name: 'Jane Doe',
        email: existingAssignor.email,
        document: existingAssignor.document,
        phone: existingAssignor.phone,
      });

      mockAssignorRepository.findById.mockResolvedValue(existingAssignor);
      mockAssignorRepository.save.mockResolvedValue(updatedAssignor);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await command.execute(updateInput);

      // Assert
      expect(mockAssignorRepository.findByDocument).not.toHaveBeenCalled();
      expect(mockAssignorRepository.save).toHaveBeenCalled();
    });

    it('should handle application service errors', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      mockApplicationService.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(command.execute(validUpdateInput)).rejects.toThrow(error);
    });
  });

  // describe('findByEmail', () => {
  //   it('should throw BadRequestException when email already exists', async () => {
  //     // Arrange
  //     const conflictingAssignor = Assignor.create({
  //       name: 'Another Person',
  //       email: 'jane.doe@example.com',
  //       document: '11111111111',
  //       phone: '11111111111',
  //     });

  //     mockAssignorRepository.findById.mockResolvedValue(existingAssignor);
  //     mockAssignorRepository.findByEmail.mockResolvedValue(conflictingAssignor);
  //     mockApplicationService.execute.mockImplementation(
  //       async (fn) => await fn(),
  //     );

  //     // Act & Assert
  //     await expect(command.execute(validUpdateInput)).rejects.toThrow(
  //       BadRequestException,
  //     );
  //     await expect(command.execute(validUpdateInput)).rejects.toThrow(
  //       'Email already exists',
  //     );

  //     expect(mockAssignorRepository.findByEmail).toHaveBeenCalledWith(
  //       validUpdateInput.email,
  //     );
  //     expect(mockAssignorRepository.findByDocument).not.toHaveBeenCalled();
  //   });
  // });

  // describe('findByDocument', () => {
  //   it('should throw BadRequestException when document already exists', async () => {
  //     // Arrange
  //     const conflictingAssignor = Assignor.create({
  //       id: '123',
  //       name: 'Another Person',
  //       email: 'another@example.com',
  //       document: '98765432109',
  //       phone: '11111111111',
  //     });

  //     mockAssignorRepository.findById.mockResolvedValue(existingAssignor);
  //     mockAssignorRepository.findByEmail.mockResolvedValue(null);
  //     mockAssignorRepository.findByDocument.mockResolvedValue(
  //       conflictingAssignor,
  //     );
  //     mockApplicationService.execute.mockImplementation(
  //       async (fn) => await fn(),
  //     );

  //     // Act & Assert
  //     await expect(command.execute(validUpdateInput)).rejects.toThrow(
  //       BadRequestException,
  //     );
  //     await expect(command.execute(validUpdateInput)).rejects.toThrow(
  //       'Document already exists',
  //     );

  //     expect(mockAssignorRepository.findByDocument).toHaveBeenCalledWith(
  //       validUpdateInput.document,
  //     );
  //   });
  // });
});
