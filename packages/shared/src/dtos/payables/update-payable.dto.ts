import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  Min,
  IsOptional,
  IsDateString,
} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePayableDto {
  @ApiProperty({
    description: 'Value of the payable',
    example: 1000.50,
    minimum: 0.01,
    required: false,
  })
  @IsNotEmpty({ message: "Value is required." })
  @IsNumber({}, { message: "Value must be a number." })
  @Min(0.01, { message: "Value must be greater than 0." })
  @IsOptional()
  value?: number;

  @ApiProperty({
    description: 'Emission date of the payable',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  @IsNotEmpty({ message: "Emission date is required." })
  @IsDateString({}, { message: "Emission date must be a valid date." })
  @IsOptional()
  emissionDate?: string;

  @ApiProperty({
    description: 'ID of the assignor associated with the payable',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsNotEmpty({ message: "Assignor is required." })
  @IsUUID("4", { message: "Assignor must be a valid UUID." })
  @IsOptional()
  assignor?: string;
}