import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  Min,
  IsDateString,
} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreatePayableDto {
  @ApiProperty({
    description: 'Value of the payable',
    example: 1000.50,
    minimum: 0.01,
  })
  @IsNotEmpty({ message: "Value is required." })
  @IsNumber({}, { message: "Value must be a number." })
  @Min(0.01, { message: "Value must be greater than 0." })
  value: number;

  @ApiProperty({
    description: 'Emission date of the payable',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsNotEmpty({ message: "Emission date is required." })
  @IsDateString({}, { message: "Emission date must be a valid date." })
  emissionDate: string;

  @ApiProperty({
    description: 'ID of the assignor associated with the payable',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: "Assignor is required." })
  @IsUUID("4", { message: "Assignor must be a valid UUID." })
  assignor: string;
}
