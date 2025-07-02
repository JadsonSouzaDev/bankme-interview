import { Test, TestingModule } from '@nestjs/testing';
import { AssignorsIntegrationController } from './assignors.controller';
import { CreateAssignorCommand } from '../../../core/assignors/application/commands/create-assignor/create-assignor.command';
import { DeleteAssignorCommand } from '../../../core/assignors/application/commands/delete-assignor/delete-assignor.command';
import { UpdateAssignorCommand } from '../../../core/assignors/application/commands/update-assignor/update-assignor.command';
import { GetAssignorQuery } from '../../../core/assignors/application/queries/get-assignor/get-assignor.query';
import { GetAllAssignorsQuery } from '../../../core/assignors/application/queries/get-all-assignors/get-all-assignors.query';
import {
  CREATE_ASSIGNOR_COMMAND,
  DELETE_ASSIGNOR_COMMAND,
  UPDATE_ASSIGNOR_COMMAND,
  GET_ASSIGNOR_QUERY,
  GET_ALL_ASSIGNORS_QUERY,
} from '../assignors.providers';
import {
  AssignorDto,
  CreateAssignorDto,
  UpdateAssignorDto,
} from '@bankme/shared';

describe('AssignorsIntegrationController', () => {
  let controller: AssignorsIntegrationController;
  let mockCreateAssignorCommand: jest.Mocked<CreateAssignorCommand>;
  let mockDeleteAssignorCommand: jest.Mocked<DeleteAssignorCommand>;
  let mockUpdateAssignorCommand: jest.Mocked<UpdateAssignorCommand>;
  let mockGetAssignorQuery: jest.Mocked<GetAssignorQuery>;
  let mockGetAllAssignorsQuery: jest.Mocked<GetAllAssignorsQuery>;

  const mockAssignorDto: AssignorDto = {
    id: 'assignor-123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    document: '12345678901',
    phone: '11987654321',
  };

  const mockCreateAssignorDto: CreateAssignorDto = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    document: '12345678901',
    phone: '11987654321',
  };

  const mockUpdateAssignorDto: UpdateAssignorDto = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  };

  beforeEach(async () => {
    mockCreateAssignorCommand = {
      execute: jest.fn(),
    } as any;

    mockDeleteAssignorCommand = {
      execute: jest.fn(),
    } as any;

    mockUpdateAssignorCommand = {
      execute: jest.fn(),
    } as any;

    mockGetAssignorQuery = {
      execute: jest.fn(),
    } as any;

    mockGetAllAssignorsQuery = {
      execute: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignorsIntegrationController],
      providers: [
        {
          provide: CREATE_ASSIGNOR_COMMAND,
          useValue: mockCreateAssignorCommand,
        },
        {
          provide: DELETE_ASSIGNOR_COMMAND,
          useValue: mockDeleteAssignorCommand,
        },
        {
          provide: UPDATE_ASSIGNOR_COMMAND,
          useValue: mockUpdateAssignorCommand,
        },
        {
          provide: GET_ASSIGNOR_QUERY,
          useValue: mockGetAssignorQuery,
        },
        {
          provide: GET_ALL_ASSIGNORS_QUERY,
          useValue: mockGetAllAssignorsQuery,
        },
      ],
    }).compile();

    controller = module.get<AssignorsIntegrationController>(
      AssignorsIntegrationController,
    );
  });

  describe('createAssignor', () => {
    it('should create assignor successfully', async () => {
      // Arrange
      mockCreateAssignorCommand.execute.mockResolvedValue(mockAssignorDto);

      // Act
      const result = await controller.createAssignor(mockCreateAssignorDto);

      // Assert
      expect(result).toEqual(mockAssignorDto);
      expect(mockCreateAssignorCommand.execute).toHaveBeenCalledWith(
        mockCreateAssignorDto,
      );
    });

    it('should handle command errors', async () => {
      // Arrange
      const error = new Error('Validation failed');
      mockCreateAssignorCommand.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(
        controller.createAssignor(mockCreateAssignorDto),
      ).rejects.toThrow(error);
    });
  });

  describe('getAllAssignors', () => {
    it('should return all assignors', async () => {
      // Arrange
      const mockAssignors = [mockAssignorDto];
      const mockResponse = {
        assignors: mockAssignors,
        total: mockAssignors.length,
      };
      mockGetAllAssignorsQuery.execute.mockResolvedValue(mockResponse);

      // Act
      const result = await controller.getAllAssignors();

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockGetAllAssignorsQuery.execute).toHaveBeenCalled();
    });

    it('should handle query errors', async () => {
      // Arrange
      const error = new Error('Database error');
      mockGetAllAssignorsQuery.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getAllAssignors()).rejects.toThrow(error);
    });
  });

  describe('getAssignor', () => {
    it('should return assignor by id', async () => {
      // Arrange
      const assignorId = 'assignor-123';
      mockGetAssignorQuery.execute.mockResolvedValue(mockAssignorDto);

      // Act
      const result = await controller.getAssignor(assignorId);

      // Assert
      expect(result).toEqual(mockAssignorDto);
      expect(mockGetAssignorQuery.execute).toHaveBeenCalledWith({
        id: assignorId,
      });
    });

    it('should handle query errors', async () => {
      // Arrange
      const assignorId = 'assignor-123';
      const error = new Error('Assignor not found');
      mockGetAssignorQuery.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getAssignor(assignorId)).rejects.toThrow(error);
    });
  });

  describe('updateAssignor', () => {
    it('should update assignor successfully', async () => {
      // Arrange
      const assignorId = 'assignor-123';
      const updatedAssignorDto = {
        ...mockAssignorDto,
        ...mockUpdateAssignorDto,
      };
      mockUpdateAssignorCommand.execute.mockResolvedValue(updatedAssignorDto);

      // Act
      const result = await controller.updateAssignor(
        assignorId,
        mockUpdateAssignorDto,
      );

      // Assert
      expect(result).toEqual(updatedAssignorDto);
      expect(mockUpdateAssignorCommand.execute).toHaveBeenCalledWith({
        id: assignorId,
        ...mockUpdateAssignorDto,
      });
    });

    it('should handle command errors', async () => {
      // Arrange
      const assignorId = 'assignor-123';
      const error = new Error('Update failed');
      mockUpdateAssignorCommand.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(
        controller.updateAssignor(assignorId, mockUpdateAssignorDto),
      ).rejects.toThrow(error);
    });
  });

  describe('deleteAssignor', () => {
    it('should delete assignor successfully', async () => {
      // Arrange
      const assignorId = 'assignor-123';
      const mockResponse = {
        success: true,
        message: 'Assignor deletado com sucesso',
      };
      mockDeleteAssignorCommand.execute.mockResolvedValue(mockResponse);

      // Act
      await controller.deleteAssignor(assignorId);

      // Assert
      expect(mockDeleteAssignorCommand.execute).toHaveBeenCalledWith({
        id: assignorId,
      });
    });

    it('should handle command errors', async () => {
      // Arrange
      const assignorId = 'assignor-123';
      const error = new Error('Delete failed');
      mockDeleteAssignorCommand.execute.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.deleteAssignor(assignorId)).rejects.toThrow(
        error,
      );
    });
  });
});
