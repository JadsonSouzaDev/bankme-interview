import { GetAllPayablesQuery } from './get-all-payables.query';
import { PayableRepository } from '../../../domain/payable.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { Payable } from '../../../domain/payable.aggregate';

describe('GetAllPayablesQuery', () => {
  let query: GetAllPayablesQuery;
  let mockPayableRepository: jest.Mocked<PayableRepository>;
  let mockApplicationService: jest.Mocked<ApplicationService>;

  const payable1 = Payable.create({
    value: 100.5,
    emissionDate: new Date('2024-01-15'),
    assignorId: 'assignor-123',
  });
  const payable2 = Payable.create({
    value: 200.75,
    emissionDate: new Date('2024-02-20'),
    assignorId: 'assignor-456',
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
    query = new GetAllPayablesQuery(
      mockPayableRepository,
      mockApplicationService,
    );
  });

  describe('execute', () => {
    it('should return all payables', async () => {
      mockPayableRepository.findAll.mockResolvedValue([payable1, payable2]);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      const result = await query.execute();
      expect(result).toEqual({
        payables: [payable1.toDto(), payable2.toDto()],
        total: 2,
      });
    });

    it('should return empty array if no payables', async () => {
      mockPayableRepository.findAll.mockResolvedValue([]);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      const result = await query.execute();
      expect(result).toEqual({ payables: [], total: 0 });
    });

    it('should propagate errors from application service', async () => {
      const error = new Error('Unexpected error');
      mockApplicationService.execute.mockRejectedValue(error);
      await expect(query.execute()).rejects.toThrow(error);
    });
  });
});
