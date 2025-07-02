import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdatePayableCommand } from './update-payable.command';
import { PayableRepository } from '../../../domain/payable.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { Payable } from '../../../domain/payable.aggregate';
import { AssignorRepository } from 'src/core/assignors/domain/assignor.repository';

describe('UpdatePayableCommand', () => {
  let command: UpdatePayableCommand;
  let mockPayableRepository: jest.Mocked<PayableRepository>;
  let mockAssignorRepository: jest.Mocked<AssignorRepository>;
  let mockApplicationService: jest.Mocked<ApplicationService>;

  const existingPayable = Payable.create({
    value: 100.5,
    emissionDate: new Date('2024-01-15'),
    assignorId: 'assignor-123',
  });

  const validUpdateInput = {
    id: existingPayable.id,
    value: 200.75,
    emissionDate: new Date('2024-02-20'),
    assignorId: 'assignor-456',
  };

  beforeEach(() => {
    mockPayableRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
      setEventPublisher: jest.fn(),
      delete: jest.fn(),
    };
    mockAssignorRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      findByEmail: jest.fn(),
      findByDocument: jest.fn(),
      save: jest.fn(),
      setEventPublisher: jest.fn(),
      delete: jest.fn(),
    };
    mockApplicationService = {
      execute: jest.fn(),
    };
    command = new UpdatePayableCommand(
      mockPayableRepository,
      mockAssignorRepository,
      mockApplicationService,
    );
  });

  describe('execute', () => {
    it('should update payable successfully', async () => {
      mockPayableRepository.findById.mockResolvedValue(existingPayable);
      mockPayableRepository.save.mockResolvedValue(existingPayable);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      const result = await command.execute(validUpdateInput);
      expect(result).toEqual(existingPayable.toDto());
      expect(mockPayableRepository.save).toHaveBeenCalledWith(existingPayable);
    });

    it('should throw NotFoundException if payable does not exist', async () => {
      mockPayableRepository.findById.mockResolvedValue(null);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      await expect(command.execute(validUpdateInput)).rejects.toThrow(
        NotFoundException,
      );
      await expect(command.execute(validUpdateInput)).rejects.toThrow(
        'Payable not found',
      );
    });

    it('should throw BadRequestException for invalid value', async () => {
      mockPayableRepository.findById.mockResolvedValue(existingPayable);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      await expect(
        command.execute({ ...validUpdateInput, value: 0 }),
      ).rejects.toThrow(Error);
      await expect(
        command.execute({ ...validUpdateInput, value: 0 }),
      ).rejects.toThrow('Valor deve ser maior que zero');
    });

    it('should throw BadRequestException for invalid assignor', async () => {
      mockPayableRepository.findById.mockResolvedValue(existingPayable);
      mockAssignorRepository.findById.mockResolvedValue(null);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      await expect(
        command.execute({ ...validUpdateInput, assignor: '123' }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        command.execute({ ...validUpdateInput, assignor: '123' }),
      ).rejects.toThrow('Assignor not found');
    });

    it('should propagate errors from application service', async () => {
      const error = new Error('Unexpected error');
      mockApplicationService.execute.mockRejectedValue(error);
      await expect(command.execute(validUpdateInput)).rejects.toThrow(error);
    });
  });
});
