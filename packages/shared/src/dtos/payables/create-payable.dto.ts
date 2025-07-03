import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  Min,
  IsDateString,
} from "class-validator";

export class CreatePayableDto {
  @IsNotEmpty({ message: "Value is required." })
  @IsNumber({}, { message: "Value must be a number." })
  @Min(0.01, { message: "Value must be greater than 0." })
  value: number;

  @IsNotEmpty({ message: "Emission date is required." })
  @IsDateString({}, { message: "Emission date must be a valid date." })
  emissionDate: string;

  @IsNotEmpty({ message: "Assignor is required." })
  @IsUUID("4", { message: "Assignor must be a valid UUID." })
  assignor: string;
}
