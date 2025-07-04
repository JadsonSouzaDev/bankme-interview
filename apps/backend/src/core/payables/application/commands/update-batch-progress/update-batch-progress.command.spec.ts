import { UpdateBatchProgressCommand } from './update-batch-progress.command';
import { BatchRepository } from '../../../domain/batch.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { Batch } from '../../../domain/batch.aggregate';
import { Queue } from 'bullmq';
import { NotFoundException } from '@nestjs/common';

describe('UpdateBatchProgressCommand', () => {
  let command: UpdateBatchProgressCommand;
  let mockDeadLetterQueue: jest.Mocked<Queue>;
  let mockBatchRepository: jest.Mocked<BatchRepository>;
  let mockApplicationService: jest.Mocked<ApplicationService>;

  const existingBatch = Batch.create({
    name: 'Test Batch',
    description: 'Test batch description',
    totalItems: 2,
  });

  const successInput = {
    batchId: existingBatch.id,
    payableStatus: 'success' as const,
  };

  const failedInput = {
    batchId: existingBatch.id,
    payableStatus: 'failed' as const,
    payload: {
      value: 100.5,
      emissionDate: new Date('2024-01-15'),
      assignor: 'assignor-123',
      errorMessage: 'Validation failed',
    },
  };

  beforeEach(() => {
    mockDeadLetterQueue = {
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

    command = new UpdateBatchProgressCommand(
      mockDeadLetterQueue,
      mockBatchRepository,
      mockApplicationService,
    );
  });

  describe('execute', () => {
    it('should update batch progress successfully for success status', async () => {
      // Arrange
      const batch = Batch.create({
        name: 'Test Batch',
        totalItems: 2,
      });
      batch.startProcessing();

      mockBatchRepository.findById.mockResolvedValue(batch);
      mockBatchRepository.save.mockResolvedValue(batch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await command.execute(successInput);

      // Assert
      expect(mockBatchRepository.findById).toHaveBeenCalledWith(
        successInput.batchId,
      );
      expect(mockBatchRepository.save).toHaveBeenCalledWith(batch);
      expect(mockDeadLetterQueue.add).not.toHaveBeenCalled();
      expect(batch.successCount).toBe(1);
      expect(batch.failedCount).toBe(0);
    });

    it('should update batch progress successfully for failed status', async () => {
      // Arrange
      const batch = Batch.create({
        name: 'Test Batch',
        totalItems: 2,
      });
      batch.startProcessing();

      mockBatchRepository.findById.mockResolvedValue(batch);
      mockBatchRepository.save.mockResolvedValue(batch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await command.execute(failedInput);

      // Assert
      expect(mockBatchRepository.findById).toHaveBeenCalledWith(
        failedInput.batchId,
      );
      expect(mockBatchRepository.save).toHaveBeenCalledWith(batch);
      expect(mockDeadLetterQueue.add).toHaveBeenCalledWith(
        'failed-payable',
        {
          ...failedInput.payload,
        },
        {
          attempts: 4,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: 100,
          removeOnFail: 50,
        },
      );
      expect(batch.successCount).toBe(0);
      expect(batch.failedCount).toBe(1);
    });

    it('should throw NotFoundException when batch does not exist', async () => {
      // Arrange
      mockBatchRepository.findById.mockResolvedValue(null);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act & Assert
      await expect(command.execute(successInput)).rejects.toThrow(
        NotFoundException,
      );
      await expect(command.execute(successInput)).rejects.toThrow(
        `Batch with ID ${successInput.batchId} not found`,
      );

      expect(mockBatchRepository.save).not.toHaveBeenCalled();
      expect(mockDeadLetterQueue.add).not.toHaveBeenCalled();
    });

    it('should mark batch as completed when all items are processed', async () => {
      // Arrange
      const batch = Batch.create({
        name: 'Test Batch',
        totalItems: 1,
      });
      batch.startProcessing();

      mockBatchRepository.findById.mockResolvedValue(batch);
      mockBatchRepository.save.mockResolvedValue(batch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await command.execute(successInput);

      // Assert
      expect(batch.status).toBe('COMPLETED');
      expect(mockBatchRepository.save).toHaveBeenCalledWith(batch);
    });

    it('should add failed payable to dead letter queue with correct payload', async () => {
      // Arrange
      const batch = Batch.create({
        name: 'Test Batch',
        totalItems: 1,
      });
      batch.startProcessing();

      const customFailedInput = {
        batchId: existingBatch.id,
        payableStatus: 'failed' as const,
        payload: {
          value: 250.75,
          emissionDate: new Date('2024-02-20'),
          assignor: 'assignor-789',
          errorMessage: 'Custom error message',
        },
      };

      mockBatchRepository.findById.mockResolvedValue(batch);
      mockBatchRepository.save.mockResolvedValue(batch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await command.execute(customFailedInput);

      // Assert
      expect(mockDeadLetterQueue.add).toHaveBeenCalledWith(
        'failed-payable',
        {
          value: 250.75,
          emissionDate: new Date('2024-02-20'),
          assignor: 'assignor-789',
          errorMessage: 'Custom error message',
        },
        {
          attempts: 4,
          backoff: { type: 'exponential', delay: 1000 },
          removeOnComplete: 100,
          removeOnFail: 50,
        },
      );
    });

    it('should propagate errors from application service', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      mockApplicationService.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(command.execute(successInput)).rejects.toThrow(error);
      expect(mockBatchRepository.findById).not.toHaveBeenCalled();
      expect(mockBatchRepository.save).not.toHaveBeenCalled();
      expect(mockDeadLetterQueue.add).not.toHaveBeenCalled();
    });

    it('should propagate errors from batch repository findById', async () => {
      // Arrange
      const error = new Error('Database error');
      mockBatchRepository.findById.mockRejectedValue(error);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act & Assert
      await expect(command.execute(successInput)).rejects.toThrow(error);
      expect(mockBatchRepository.save).not.toHaveBeenCalled();
      expect(mockDeadLetterQueue.add).not.toHaveBeenCalled();
    });

    it('should propagate errors from batch repository save', async () => {
      // Arrange
      const batch = Batch.create({
        name: 'Test Batch',
        totalItems: 2,
      });
      batch.startProcessing();

      const error = new Error('Save failed');
      mockBatchRepository.findById.mockResolvedValue(batch);
      mockBatchRepository.save.mockRejectedValue(error);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act & Assert
      await expect(command.execute(successInput)).rejects.toThrow(error);
    });

    it('should propagate errors from dead letter queue', async () => {
      // Arrange
      const batch = Batch.create({
        name: 'Test Batch',
        totalItems: 2,
      });
      batch.startProcessing();

      const error = new Error('Queue error');
      mockBatchRepository.findById.mockResolvedValue(batch);
      mockBatchRepository.save.mockResolvedValue(batch);
      mockDeadLetterQueue.add.mockRejectedValue(error);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act & Assert
      await expect(command.execute(failedInput)).rejects.toThrow(error);
    });

    it('should call batch.updateProgress with correct parameters', async () => {
      // Arrange
      const batch = Batch.create({
        name: 'Test Batch',
        totalItems: 2,
      });
      batch.startProcessing();

      mockBatchRepository.findById.mockResolvedValue(batch);
      mockBatchRepository.save.mockResolvedValue(batch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await command.execute(successInput);

      // Assert
      expect(mockBatchRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          successCount: 1,
          failedCount: 0,
        }),
      );
    });

    it('should handle multiple success updates correctly', async () => {
      // Arrange
      const batch = Batch.create({
        name: 'Test Batch',
        totalItems: 3,
      });
      batch.startProcessing();

      mockBatchRepository.findById.mockResolvedValue(batch);
      mockBatchRepository.save.mockResolvedValue(batch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await command.execute(successInput);
      await command.execute(successInput);
      await command.execute(successInput);

      // Assert
      expect(batch.successCount).toBe(3);
      expect(batch.failedCount).toBe(0);
      expect(batch.status).toBe('COMPLETED');
    });

    it('should handle mixed success and failed updates correctly', async () => {
      // Arrange
      const batch = Batch.create({
        name: 'Test Batch',
        totalItems: 2,
      });
      batch.startProcessing();

      mockBatchRepository.findById.mockResolvedValue(batch);
      mockBatchRepository.save.mockResolvedValue(batch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await command.execute(successInput);
      await command.execute(failedInput);

      // Assert
      expect(batch.successCount).toBe(1);
      expect(batch.failedCount).toBe(1);
      expect(batch.status).toBe('COMPLETED');
      expect(mockDeadLetterQueue.add).toHaveBeenCalledTimes(1);
    });
  });
});
