import { BadRequestException } from '@nestjs/common';
import { CreatePayableCommand } from './create-payable.command';
import { PayableRepository } from '../../../domain/payable.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { Payable } from '../../../domain/payable.aggregate';
import { AssignorRepository } from '../../../../assignors/domain/assignor.repository';
import { Assignor } from '../../../../assignors/domain/assignor.aggregate';

describe('CreatePayableCommand', () => {
  let command: CreatePayableCommand;
  let mockPayableRepository: jest.Mocked<PayableRepository>;
  let mockAssignorRepository: jest.Mocked<AssignorRepository>;
  let mockApplicationService: jest.Mocked<ApplicationService>;

  const validInput = {
    value: 100.5,
    emissionDate: new Date('2024-01-15'),
    assignor: 'assignor-123',
    assignorId: 'assignor-123',
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
    command = new CreatePayableCommand(
      mockPayableRepository,
      mockAssignorRepository,
      mockApplicationService,
    );
  });

  describe('execute', () => {
    it('should create payable successfully', async () => {
      const mockAssignor = Assignor.create({
        name: 'John Doe',
        email: 'john.doe@example.com',
        document: '12345678901',
        phone: '11987654321',
      });
      const mockPayable = Payable.create(validInput);
      mockPayableRepository.save.mockResolvedValue(mockPayable);
      mockAssignorRepository.findById.mockResolvedValue(mockAssignor);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      const result = await command.execute(validInput);
      expect(result).toEqual(mockPayable.toDto());
      expect(mockPayableRepository.save).toHaveBeenCalledWith(
        expect.any(Payable),
      );
    });

    it('should throw BadRequestException for invalid assignorId', async () => {
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      await expect(
        command.execute({ ...validInput, assignor: '' }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        command.execute({ ...validInput, assignor: '' }),
      ).rejects.toThrow('Assignor not found');
    });

    it('should propagate errors from application service', async () => {
      const error = new Error('Unexpected error');
      mockApplicationService.execute.mockRejectedValue(error);
      await expect(command.execute(validInput)).rejects.toThrow(error);
    });
  });
});
