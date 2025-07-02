import { GetAllAssignorsQuery } from './get-all-assignors.query';
import { AssignorRepository } from '../../../domain/assignor.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { Assignor } from '../../../domain/assignor.aggregate';

describe('GetAllAssignorsQuery', () => {
  let query: GetAllAssignorsQuery;
  let mockAssignorRepository: jest.Mocked<AssignorRepository>;
  let mockApplicationService: jest.Mocked<ApplicationService>;

  const assignor1 = Assignor.create({
    name: 'John Doe',
    email: 'john.doe@example.com',
    document: '12345678901',
    phone: '11987654321',
  });
  const assignor2 = Assignor.create({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    document: '98765432109',
    phone: '11876543210',
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
    query = new GetAllAssignorsQuery(
      mockAssignorRepository,
      mockApplicationService,
    );
  });

  describe('execute', () => {
    it('should return all assignors', async () => {
      mockAssignorRepository.findAll.mockResolvedValue([assignor1, assignor2]);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      const result = await query.execute();
      expect(result).toEqual({
        assignors: [assignor1.toDto(), assignor2.toDto()],
        total: 2,
      });
    });

    it('should return empty array if no assignors', async () => {
      mockAssignorRepository.findAll.mockResolvedValue([]);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );
      const result = await query.execute();
      expect(result).toEqual({ assignors: [], total: 0 });
    });

    it('should propagate errors from application service', async () => {
      const error = new Error('Unexpected error');
      mockApplicationService.execute.mockRejectedValue(error);
      await expect(query.execute()).rejects.toThrow(error);
    });
  });
});
