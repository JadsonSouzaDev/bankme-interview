import { ApiProperty } from '@nestjs/swagger';

export type BatchStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

type BatchDtoConstructor = {
  id: string;
  status: BatchStatus;
  totalItems: number;
  successCount: number;
  failedCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export class BatchDto {
  @ApiProperty({
    description: 'Unique ID of the batch',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Status of the batch processing',
    example: 'PENDING',
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
  })
  status: BatchStatus;

  @ApiProperty({
    description: 'Total of items in the batch',
    example: 100,
  })
  totalItems: number;

  @ApiProperty({
    description: 'Quantity of items processed successfully',
    example: 95,
  })
  successCount: number;

  @ApiProperty({
    description: 'Quantity of items that failed in the processing',
    example: 5,
  })
  failedCount: number;

  @ApiProperty({
    description: 'Creation date of the batch',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date of the batch',
    example: '2024-01-15T10:35:00.000Z',
  })
  updatedAt: Date;

  constructor(props: BatchDtoConstructor) {
    this.id = props.id;
    this.status = props.status;
    this.totalItems = props.totalItems;
    this.successCount = props.successCount;
    this.failedCount = props.failedCount;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
} 