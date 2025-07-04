import { Test, TestingModule } from '@nestjs/testing';
import { PayablesIntegrationController } from './payables.controller';
import { CreatePayableCommand } from '../../../core/payables/application/commands/create-payable/create-payable.command';
import { DeletePayableCommand } from '../../../core/payables/application/commands/delete-payable/delete-payable.command';
import { UpdatePayableCommand } from '../../../core/payables/application/commands/update-payable/update-payable.command';
import { GetPayableQuery } from '../../../core/payables/application/queries/get-payable/get-payable.query';
import { GetAllPayablesQuery } from '../../../core/payables/application/queries/get-all-payables/get-all-payables.query';
import { CreatePayablesBatchCommand } from '../../../core/payables/application/commands/create-payables-batch/create-payables-batch.command';
import {
  CREATE_PAYABLE_COMMAND,
  CREATE_PAYABLES_BATCH_COMMAND,
  DELETE_PAYABLE_COMMAND,
  UPDATE_PAYABLE_COMMAND,
  GET_PAYABLE_QUERY,
  GET_ALL_PAYABLES_QUERY,
} from '../payables.providers';
import { PayableDto } from '@bankme/shared';

describe('PayablesController', () => {
  let controller: PayablesIntegrationController;
  let mockCreatePayableCommand: jest.Mocked<CreatePayableCommand>;
  let mockCreatePayablesBatchCommand: jest.Mocked<CreatePayablesBatchCommand>;
  let mockDeletePayableCommand: jest.Mocked<DeletePayableCommand>;
  let mockUpdatePayableCommand: jest.Mocked<UpdatePayableCommand>;
  let mockGetPayableQuery: jest.Mocked<GetPayableQuery>;
  let mockGetAllPayablesQuery: jest.Mocked<GetAllPayablesQuery>;

  const mockPayableDto: PayableDto = {
    id: 'payable-123',
    value: 100.5,
    emissionDate: new Date('2024-01-15'),
    assignorId: 'assignor-123',
  };

  const mockCreatePayableDto = {
    value: 100.5,
    emissionDate: new Date('2024-01-15'),
    assignor: 'assignor-123',
  };

  const mockUpdatePayableDto = {
    value: 200.75,
    emissionDate: new Date('2024-02-20'),
    assignor: 'assignor-456',
  };

  beforeEach(async () => {
    mockCreatePayableCommand = {
      execute: jest.fn(),
    } as any;
    mockCreatePayablesBatchCommand = {
      execute: jest.fn(),
    } as any;
    mockDeletePayableCommand = {
      execute: jest.fn(),
    } as any;
    mockUpdatePayableCommand = {
      execute: jest.fn(),
    } as any;
    mockGetPayableQuery = {
      execute: jest.fn(),
    } as any;
    mockGetAllPayablesQuery = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayablesIntegrationController],
      providers: [
        { provide: CREATE_PAYABLE_COMMAND, useValue: mockCreatePayableCommand },
        {
          provide: CREATE_PAYABLES_BATCH_COMMAND,
          useValue: mockCreatePayablesBatchCommand,
        },
        { provide: DELETE_PAYABLE_COMMAND, useValue: mockDeletePayableCommand },
        { provide: UPDATE_PAYABLE_COMMAND, useValue: mockUpdatePayableCommand },
        { provide: GET_PAYABLE_QUERY, useValue: mockGetPayableQuery },
        { provide: GET_ALL_PAYABLES_QUERY, useValue: mockGetAllPayablesQuery },
      ],
    }).compile();

    controller = module.get<PayablesIntegrationController>(
      PayablesIntegrationController,
    );
  });

  describe('createPayable', () => {
    it('should create payable successfully', async () => {
      mockCreatePayableCommand.execute.mockResolvedValue(mockPayableDto);
      const result = await controller.createPayable({
        ...mockCreatePayableDto,
        emissionDate: mockCreatePayableDto.emissionDate.toISOString(),
      });
      expect(result).toEqual(mockPayableDto);
      expect(mockCreatePayableCommand.execute).toHaveBeenCalledWith(
        mockCreatePayableDto,
      );
    });
    it('should handle command errors', async () => {
      const error = new Error('Validation failed');
      mockCreatePayableCommand.execute.mockRejectedValue(error);
      await expect(
        controller.createPayable({
          ...mockCreatePayableDto,
          emissionDate: mockCreatePayableDto.emissionDate.toISOString(),
        }),
      ).rejects.toThrow(error);
    });
  });

  describe('getAllPayables', () => {
    it('should return all payables', async () => {
      const mockPayables = [mockPayableDto];
      const mockResponse = { payables: mockPayables, total: 1 };
      mockGetAllPayablesQuery.execute.mockResolvedValue(mockResponse);
      const result = await controller.getAllPayables();
      expect(result).toEqual(mockResponse);
      expect(mockGetAllPayablesQuery.execute).toHaveBeenCalled();
    });
    it('should handle query errors', async () => {
      const error = new Error('Database error');
      mockGetAllPayablesQuery.execute.mockRejectedValue(error);
      await expect(controller.getAllPayables()).rejects.toThrow(error);
    });
  });

  describe('getPayable', () => {
    it('should return payable by id', async () => {
      const payableId = 'payable-123';
      mockGetPayableQuery.execute.mockResolvedValue(mockPayableDto);
      const result = await controller.getPayable(payableId);
      expect(result).toEqual(mockPayableDto);
      expect(mockGetPayableQuery.execute).toHaveBeenCalledWith({
        id: payableId,
      });
    });
    it('should handle query errors', async () => {
      const payableId = 'payable-123';
      const error = new Error('Payable not found');
      mockGetPayableQuery.execute.mockRejectedValue(error);
      await expect(controller.getPayable(payableId)).rejects.toThrow(error);
    });
  });

  describe('updatePayable', () => {
    it('should update payable successfully', async () => {
      const payableId = 'payable-123';
      const updatedPayableDto = { ...mockPayableDto, ...mockUpdatePayableDto };
      mockUpdatePayableCommand.execute.mockResolvedValue(updatedPayableDto);
      const result = await controller.updatePayable(payableId, {
        ...mockUpdatePayableDto,
        emissionDate: mockUpdatePayableDto.emissionDate.toISOString(),
      });
      expect(result).toEqual(updatedPayableDto);
      expect(mockUpdatePayableCommand.execute).toHaveBeenCalledWith({
        id: payableId,
        ...mockUpdatePayableDto,
      });
    });
    it('should handle command errors', async () => {
      const payableId = 'payable-123';
      const error = new Error('Update failed');
      mockUpdatePayableCommand.execute.mockRejectedValue(error);
      await expect(
        controller.updatePayable(payableId, {
          ...mockUpdatePayableDto,
          emissionDate: mockUpdatePayableDto.emissionDate.toISOString(),
        }),
      ).rejects.toThrow(error);
    });
  });

  describe('deletePayable', () => {
    it('should delete payable successfully', async () => {
      const payableId = 'payable-123';
      const mockResponse = {
        success: true,
        message: 'Payable deletado com sucesso',
      };
      mockDeletePayableCommand.execute.mockResolvedValue(mockResponse);
      await controller.deletePayable(payableId);
      expect(mockDeletePayableCommand.execute).toHaveBeenCalledWith({
        id: payableId,
      });
    });
    it('should handle command errors', async () => {
      const payableId = 'payable-123';
      const error = new Error('Delete failed');
      mockDeletePayableCommand.execute.mockRejectedValue(error);
      await expect(controller.deletePayable(payableId)).rejects.toThrow(error);
    });
  });
});
