import { ApiProperty } from '@nestjs/swagger';

type PayableBatchDtoConstructor = {
  batchId: string;
  total: number;
  success: number;
  failed: number;
};

export class PayableBatchDto {
  @ApiProperty({
    description: 'ID of the created batch',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  batchId: string;

  @ApiProperty({
    description: 'Total of payables in the batch',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Quantity of payables processed successfully',
    example: 95,
  })
  success: number;

  @ApiProperty({
    description: 'Quantity of payables that failed in the processing',
    example: 5,
  })
  failed: number;

  constructor(props: PayableBatchDtoConstructor) {
    this.batchId = props.batchId;
    this.total = props.total;
    this.success = props.success;
    this.failed = props.failed;
  }
}