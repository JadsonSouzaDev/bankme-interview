import { CreatePayablesBatchCommand } from './create-payables-batch.command';
import { BatchRepository } from '../../../domain/batch.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { Batch } from '../../../domain/batch.aggregate';
import { PayableBatchDto } from '@bankme/shared';
import { Queue } from 'bullmq';

describe('CreatePayablesBatchCommand', () => {
  let command: CreatePayablesBatchCommand;
  let mockPayableQueue: jest.Mocked<Queue>;
  let mockBatchRepository: jest.Mocked<BatchRepository>;
  let mockApplicationService: jest.Mocked<ApplicationService>;

  const validInput = {
    payables: [
      {
        value: 100.5,
        emissionDate: new Date('2024-01-15'),
        assignor: 'assignor-123',
      },
      {
        value: 200.75,
        emissionDate: new Date('2024-01-16'),
        assignor: 'assignor-456',
      },
    ],
    batchName: 'Test Batch',
    batchDescription: 'Test batch description',
  };

  beforeEach(() => {
    mockPayableQueue = {
      add: jest.fn(),
    } as unknown as jest.Mocked<Queue>;

    mockBatchRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findByStatus: jest.fn(),
      updateProgress: jest.fn(),
    };

    mockApplicationService = {
      execute: jest.fn(),
    };

    command = new CreatePayablesBatchCommand(
      mockPayableQueue,
      mockBatchRepository,
      mockApplicationService,
    );
  });

  describe('execute', () => {
    it('should create batch and add payables to queue successfully', async () => {
      const mockBatch = Batch.create({
        name: validInput.batchName,
        description: validInput.batchDescription,
        totalItems: validInput.payables.length,
      });
      const expectedDto = new PayableBatchDto({
        batchId: mockBatch.id,
        total: validInput.payables.length,
        success: 0,
        failed: 0,
      });

      mockBatchRepository.save.mockResolvedValue(mockBatch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      const result = await command.execute(validInput);

      expect(result).toEqual({ ...expectedDto, batchId: result.batchId });
      expect(mockBatchRepository.save).toHaveBeenCalledWith(expect.any(Batch));
      expect(mockPayableQueue.add).toHaveBeenCalledTimes(
        validInput.payables.length,
      );
      expect(mockApplicationService.execute).toHaveBeenCalled();

      validInput.payables.forEach((payable, index) => {
        expect(mockPayableQueue.add).toHaveBeenNthCalledWith(
          index + 1,
          'create-payable',
          {
            ...payable,
            assignorId: payable.assignor,
            batchId: result.batchId,
          },
          {
            attempts: 4,
            backoff: {
              type: 'exponential',
              delay: 1000,
            },
            removeOnComplete: 100,
            removeOnFail: 50,
          },
        );
      });
    });

    it('should create batch without optional fields', async () => {
      // Arrange
      const inputWithoutOptionalFields = {
        payables: [
          {
            value: 100.5,
            emissionDate: new Date('2024-01-15'),
            assignor: 'assignor-123',
          },
        ],
      };

      const mockBatch = Batch.create({
        totalItems: inputWithoutOptionalFields.payables.length,
      });
      const expectedDto = new PayableBatchDto({
        batchId: mockBatch.id,
        total: inputWithoutOptionalFields.payables.length,
        success: 0,
        failed: 0,
      });

      mockBatchRepository.save.mockResolvedValue(mockBatch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await command.execute(inputWithoutOptionalFields);

      // Assert
      expect(result).toEqual({ ...expectedDto, batchId: result.batchId });
      expect(mockBatchRepository.save).toHaveBeenCalledWith(expect.any(Batch));
      expect(mockPayableQueue.add).toHaveBeenCalledTimes(1);
    });

    it('should handle empty payables array', async () => {
      // Arrange
      const inputWithEmptyPayables = {
        payables: [],
        batchName: 'Empty Batch',
      };

      const mockBatch = Batch.create({
        name: inputWithEmptyPayables.batchName,
        totalItems: 0,
      });
      const expectedDto = new PayableBatchDto({
        batchId: mockBatch.id,
        total: 0,
        success: 0,
        failed: 0,
      });

      mockBatchRepository.save.mockResolvedValue(mockBatch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await command.execute(inputWithEmptyPayables);

      // Assert
      expect(result).toEqual({ ...expectedDto, batchId: result.batchId });
      expect(mockBatchRepository.save).toHaveBeenCalledWith(expect.any(Batch));
      expect(mockPayableQueue.add).not.toHaveBeenCalled();
    });

    it('should propagate errors from application service', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      mockApplicationService.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(command.execute(validInput)).rejects.toThrow(error);
      expect(mockBatchRepository.save).not.toHaveBeenCalled();
      expect(mockPayableQueue.add).not.toHaveBeenCalled();
    });

    it('should propagate errors from batch repository', async () => {
      // Arrange
      const error = new Error('Save failed');
      mockBatchRepository.save.mockRejectedValue(error);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act & Assert
      await expect(command.execute(validInput)).rejects.toThrow(error);
      expect(mockPayableQueue.add).not.toHaveBeenCalled();
    });

    it('should propagate errors from queue', async () => {
      // Arrange
      const mockBatch = Batch.create({
        name: validInput.batchName,
        description: validInput.batchDescription,
        totalItems: validInput.payables.length,
      });
      const error = new Error('Queue error');

      mockBatchRepository.save.mockResolvedValue(mockBatch);
      mockPayableQueue.add.mockRejectedValue(error);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act & Assert
      await expect(command.execute(validInput)).rejects.toThrow(error);
    });

    it('should call batch.startProcessing() before saving', async () => {
      // Arrange
      const mockBatch = Batch.create({
        name: validInput.batchName,
        description: validInput.batchDescription,
        totalItems: validInput.payables.length,
      });

      mockBatchRepository.save.mockResolvedValue(mockBatch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await command.execute(validInput);

      // Assert
      expect(mockBatchRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'PROCESSING',
        }),
      );
    });

    it('should create batch with correct total items count', async () => {
      // Arrange
      const largeInput = {
        payables: Array.from({ length: 10 }, (_, i) => ({
          value: 100 + i,
          emissionDate: new Date('2024-01-15'),
          assignor: `assignor-${i}`,
        })),
        batchName: 'Large Batch',
      };

      const mockBatch = Batch.create({
        name: largeInput.batchName,
        totalItems: largeInput.payables.length,
      });

      mockBatchRepository.save.mockResolvedValue(mockBatch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await command.execute(largeInput);

      // Assert
      expect(result.total).toBe(10);
      expect(mockBatchRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          totalItems: 10,
        }),
      );
      expect(mockPayableQueue.add).toHaveBeenCalledTimes(10);
    });
  });
});
