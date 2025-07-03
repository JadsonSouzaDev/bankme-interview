import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  Min,
  IsOptional,
  IsDateString,
} from "class-validator";

export class UpdatePayableDto {
  @IsNotEmpty({ message: "Value is required." })
  @IsNumber({}, { message: "Value must be a number." })
  @Min(0.01, { message: "Value must be greater than 0." })
  @IsOptional()
  value?: number;

  @IsNotEmpty({ message: "Emission date is required." })
  @IsDateString({}, { message: "Emission date must be a valid date." })
  @IsOptional()
  emissionDate?: string;

  @IsNotEmpty({ message: "Assignor is required." })
  @IsUUID("4", { message: "Assignor must be a valid UUID." })
  @IsOptional()
  assignor?: string;
}