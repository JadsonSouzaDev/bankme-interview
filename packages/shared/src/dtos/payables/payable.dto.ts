import { ApiProperty } from '@nestjs/swagger';

type PayableDtoConstructor = {
  id: string;
  assignorId: string;
  value: number;
  emissionDate: Date;
  batchId?: string;
};

export class PayableDto {
  @ApiProperty({
    description: 'Unique ID of the payable',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'ID of the assignor associated with the payable',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  assignorId: string;

  @ApiProperty({
    description: 'Value of the payable',
    example: 1000.50,
  })
  value: number;

  @ApiProperty({
    description: 'Emission date of the payable',
    example: '2024-01-15T10:30:00.000Z',
  })
  emissionDate: Date;

  @ApiProperty({
    description: 'ID of the batch (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  batchId?: string;

  constructor(props: PayableDtoConstructor) {
    this.id = props.id;
    this.assignorId = props.assignorId;
    this.value = props.value;
    this.emissionDate = props.emissionDate;
    this.batchId = props.batchId;
  }
}