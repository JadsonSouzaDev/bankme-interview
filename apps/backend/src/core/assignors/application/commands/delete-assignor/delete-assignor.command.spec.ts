import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DeleteAssignorCommand } from './delete-assignor.command';
import { AssignorRepository } from '../../../domain/assignor.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { Assignor } from '../../../domain/assignor.aggregate';

describe('DeleteAssignorCommand', () => {
  let command: DeleteAssignorCommand;
  let mockAssignorRepository: jest.Mocked<AssignorRepository>;
  let mockApplicationService: jest.Mocked<ApplicationService>;

  const existingAssignor = Assignor.create({
    name: 'John Doe',
    email: 'john.doe@example.com',
    document: '12345678901',
    phone: '11987654321',
  });

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
    command = new DeleteAssignorCommand(
      mockAssignorRepository,
      mockApplicationService,
    );
  });

  describe('execute', () => {
    it('should delete assignor successfully', async () => {
      // Arrange
      mockAssignorRepository.findById.mockResolvedValue(existingAssignor);
      mockAssignorRepository.save.mockResolvedValue(existingAssignor);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await command.execute({ id: existingAssignor.id });

      // Assert
      expect(result).toEqual({
        success: true,
        message: 'Assignor deletado com sucesso',
      });
      expect(mockAssignorRepository.findById).toHaveBeenCalledWith(
        existingAssignor.id,
      );
      expect(mockAssignorRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if assignor does not exist', async () => {
      mockAssignorRepository.findById.mockResolvedValue(null);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      await expect(command.execute({ id: 'not-exist' })).rejects.toThrow(
        NotFoundException,
      );
      await expect(command.execute({ id: 'not-exist' })).rejects.toThrow(
        'Assignor not found',
      );
    });

    it('should throw BadRequestException if assignor is already deleted', async () => {
      const inactiveAssignor = Assignor.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        document: '12345678901',
        phone: '11987654321',
      });
      inactiveAssignor.deactivate();
      mockAssignorRepository.findById.mockResolvedValue(inactiveAssignor);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      await expect(
        command.execute({ id: inactiveAssignor.id }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        command.execute({ id: inactiveAssignor.id }),
      ).rejects.toThrow('Assignor já foi deletado');
    });

    it('should propagate errors from application service', async () => {
      const error = new Error('Unexpected error');
      mockApplicationService.execute.mockRejectedValue(error);
      await expect(
        command.execute({ id: existingAssignor.id }),
      ).rejects.toThrow(error);
    });
  });
});
