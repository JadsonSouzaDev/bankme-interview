import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DeletePayableCommand } from './delete-payable.command';
import { PayableRepository } from '../../../domain/payable.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { Payable } from '../../../domain/payable.aggregate';

describe('DeletePayableCommand', () => {
  let command: DeletePayableCommand;
  let mockPayableRepository: jest.Mocked<PayableRepository>;
  let mockApplicationService: jest.Mocked<ApplicationService>;

  const existingPayable = Payable.create({
    value: 100.5,
    emissionDate: new Date('2024-01-15'),
    assignorId: 'assignor-123',
  });

  beforeEach(() => {
    mockPayableRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      setEventPublisher: jest.fn(),
      delete: jest.fn(),
    };
    mockApplicationService = {
      execute: jest.fn(),
    };
    command = new DeletePayableCommand(
      mockPayableRepository,
      mockApplicationService,
    );
  });

  describe('execute', () => {
    it('should delete payable successfully', async () => {
      mockPayableRepository.findById.mockResolvedValue(existingPayable);
      mockPayableRepository.save.mockResolvedValue(existingPayable);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      const result = await command.execute({ id: existingPayable.id });
      expect(result).toEqual({
        success: true,
        message: 'Payable deleted successfully',
      });
      expect(mockPayableRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if payable does not exist', async () => {
      mockPayableRepository.findById.mockResolvedValue(null);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      await expect(command.execute({ id: 'not-exist' })).rejects.toThrow(
        NotFoundException,
      );
      await expect(command.execute({ id: 'not-exist' })).rejects.toThrow(
        'Payable not found',
      );
    });

    it('should throw BadRequestException if payable is already deleted', async () => {
      const inactivePayable = Payable.create({
        value: 100.5,
        emissionDate: new Date('2024-01-15'),
        assignorId: 'assignor-123',
      });
      inactivePayable.deactivate();
      mockPayableRepository.findById.mockResolvedValue(inactivePayable);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      await expect(command.execute({ id: inactivePayable.id })).rejects.toThrow(
        BadRequestException,
      );
      await expect(command.execute({ id: inactivePayable.id })).rejects.toThrow(
        'Payable already deleted',
      );
    });

    it('should propagate errors from application service', async () => {
      const error = new Error('Unexpected error');
      mockApplicationService.execute.mockRejectedValue(error);
      await expect(command.execute({ id: existingPayable.id })).rejects.toThrow(
        error,
      );
    });
  });
});
