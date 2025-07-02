import { NotFoundException } from '@nestjs/common';
import { GetPayableQuery } from './get-payable.query';
import { PayableRepository } from '../../../domain/payable.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { Payable } from '../../../domain/payable.aggregate';

describe('GetPayableQuery', () => {
  let query: GetPayableQuery;
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
    query = new GetPayableQuery(mockPayableRepository, mockApplicationService);
  });

  describe('execute', () => {
    it('should return payable DTO when payable exists', async () => {
      mockPayableRepository.findById.mockResolvedValue(existingPayable);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      const result = await query.execute({ id: existingPayable.id });
      expect(result).toEqual(existingPayable.toDto());
    });

    it('should throw NotFoundException when payable does not exist', async () => {
      mockPayableRepository.findById.mockResolvedValue(null);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      await expect(query.execute({ id: 'not-exist' })).rejects.toThrow(
        NotFoundException,
      );
      await expect(query.execute({ id: 'not-exist' })).rejects.toThrow(
        'Payable not found',
      );
    });

    it('should propagate errors from application service', async () => {
      const error = new Error('Unexpected error');
      mockApplicationService.execute.mockRejectedValue(error);
      await expect(query.execute({ id: existingPayable.id })).rejects.toThrow(
        error,
      );
    });
  });
});
