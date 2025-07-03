import {
  IsNotEmpty,
  IsUUID,
  IsNumber,
  Min,
  IsDateString,
} from "class-validator";

export class CreatePayableDto {
  @IsNotEmpty({ message: "O valor é obrigatório." })
  @IsNumber({}, { message: "O valor deve ser um número." })
  @Min(0.01, { message: "O valor deve ser maior que 0." })
  value: number;

  @IsNotEmpty({ message: "A data de emissão é obrigatória." })
  @IsDateString({}, { message: "A data de emissão deve ser uma data válida." })
  emissionDate: string;

  @IsNotEmpty({ message: "O assignor é obrigatório." })
  @IsUUID("4", { message: "O assignor deve ser um UUID válido." })
  assignor: string;
}
