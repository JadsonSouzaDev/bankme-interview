import { GetBatchQuery } from './get-batch.query';
import { BatchRepository } from '../../../domain/batch.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { Batch } from '../../../domain/batch.aggregate';

describe('GetBatchQuery', () => {
  let query: GetBatchQuery;
  let mockBatchRepository: jest.Mocked<BatchRepository>;
  let mockApplicationService: jest.Mocked<ApplicationService>;

  const existingBatch = Batch.create({
    name: 'Test Batch',
    description: 'Test batch description',
    totalItems: 5,
  });

  const validInput = {
    id: existingBatch.id,
  };

  beforeEach(() => {
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

    query = new GetBatchQuery(mockApplicationService, mockBatchRepository);
  });

  describe('execute', () => {
    it('should return batch DTO when batch exists', async () => {
      // Arrange
      const expectedDto = existingBatch.toDto();

      mockBatchRepository.findById.mockResolvedValue(existingBatch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await query.execute(validInput);

      // Assert
      expect(result).toEqual(expectedDto);
      expect(mockBatchRepository.findById).toHaveBeenCalledWith(validInput.id);
      expect(mockApplicationService.execute).toHaveBeenCalled();
    });

    it('should return undefined when batch does not exist', async () => {
      // Arrange
      mockBatchRepository.findById.mockResolvedValue(null);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await query.execute(validInput);

      // Assert
      expect(result).toBeUndefined();
      expect(mockBatchRepository.findById).toHaveBeenCalledWith(validInput.id);
      expect(mockApplicationService.execute).toHaveBeenCalled();
    });

    it('should return batch with correct DTO structure', async () => {
      // Arrange
      const batch = Batch.create({
        name: 'Custom Batch',
        description: 'Custom description',
        totalItems: 10,
      });
      batch.startProcessing();

      const expectedDto = batch.toDto();

      mockBatchRepository.findById.mockResolvedValue(batch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await query.execute({ id: batch.id });

      // Assert
      expect(result).toEqual(expectedDto);
      expect(result).toHaveProperty('id', batch.id);
      expect(result).toHaveProperty('status', batch.status);
      expect(result).toHaveProperty('totalItems', batch.totalItems);
      expect(result).toHaveProperty('successCount', batch.successCount);
      expect(result).toHaveProperty('failedCount', batch.failedCount);
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });

    it('should handle batch in different statuses', async () => {
      // Arrange
      const pendingBatch = Batch.create({
        name: 'Pending Batch',
        totalItems: 3,
      });

      const processingBatch = Batch.create({
        name: 'Processing Batch',
        totalItems: 3,
      });
      processingBatch.startProcessing();

      const completedBatch = Batch.create({
        name: 'Completed Batch',
        totalItems: 1,
      });
      completedBatch.startProcessing();
      completedBatch.updateProgress(1, 0);

      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Test pending batch
      mockBatchRepository.findById.mockResolvedValue(pendingBatch);
      let result = await query.execute({ id: pendingBatch.id });
      expect(result?.status).toBe('PENDING');

      // Test processing batch
      mockBatchRepository.findById.mockResolvedValue(processingBatch);
      result = await query.execute({ id: processingBatch.id });
      expect(result?.status).toBe('PROCESSING');

      // Test completed batch
      mockBatchRepository.findById.mockResolvedValue(completedBatch);
      result = await query.execute({ id: completedBatch.id });
      expect(result?.status).toBe('COMPLETED');
    });

    it('should propagate errors from application service', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      mockApplicationService.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(query.execute(validInput)).rejects.toThrow(error);
      expect(mockBatchRepository.findById).not.toHaveBeenCalled();
    });

    it('should propagate errors from batch repository', async () => {
      // Arrange
      const error = new Error('Database error');
      mockBatchRepository.findById.mockRejectedValue(error);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act & Assert
      await expect(query.execute(validInput)).rejects.toThrow(error);
    });

    it('should call findById with correct batch ID', async () => {
      // Arrange
      const customBatchId = 'custom-batch-id';
      mockBatchRepository.findById.mockResolvedValue(existingBatch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      await query.execute({ id: customBatchId });

      // Assert
      expect(mockBatchRepository.findById).toHaveBeenCalledWith(customBatchId);
    });

    it('should return batch with progress information', async () => {
      // Arrange
      const batch = Batch.create({
        name: 'Progress Batch',
        totalItems: 4,
      });
      batch.startProcessing();
      batch.incrementSuccess();
      batch.incrementSuccess();
      batch.incrementFailed({
        value: 100,
        emissionDate: new Date('2024-01-15'),
        assignorId: 'assignor-123',
        errorMessage: 'Test error',
      });

      const expectedDto = batch.toDto();

      mockBatchRepository.findById.mockResolvedValue(batch);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await query.execute({ id: batch.id });

      // Assert
      expect(result).toEqual(expectedDto);
      expect(result?.successCount).toBe(2);
      expect(result?.failedCount).toBe(1);
      expect(result?.totalItems).toBe(4);
    });

    it('should handle batch without optional fields', async () => {
      // Arrange
      const batchWithoutOptionalFields = Batch.create({
        totalItems: 1,
      });

      const expectedDto = batchWithoutOptionalFields.toDto();

      mockBatchRepository.findById.mockResolvedValue(
        batchWithoutOptionalFields,
      );
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await query.execute({
        id: batchWithoutOptionalFields.id,
      });

      // Assert
      expect(result).toEqual(expectedDto);
      expect(result?.id).toBe(batchWithoutOptionalFields.id);
      expect(result?.status).toBe('PENDING');
      expect(result?.totalItems).toBe(1);
      expect(result?.successCount).toBe(0);
      expect(result?.failedCount).toBe(0);
    });

    it('should return undefined for non-existent batch ID', async () => {
      // Arrange
      const nonExistentId = 'non-existent-id';
      mockBatchRepository.findById.mockResolvedValue(null);
      mockApplicationService.execute.mockImplementation(
        async (fn) => await fn(),
      );

      // Act
      const result = await query.execute({ id: nonExistentId });

      // Assert
      expect(result).toBeUndefined();
      expect(mockBatchRepository.findById).toHaveBeenCalledWith(nonExistentId);
    });
  });
});
