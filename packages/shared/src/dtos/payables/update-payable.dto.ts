import { IsNotEmpty, IsUUID, IsNumber, IsDateString, Min, IsOptional } from 'class-validator';

export class UpdatePayableDto {
  @IsNotEmpty({ message: 'O valor é obrigatório.' })
  @IsNumber({}, { message: 'O valor deve ser um número.' })
  @Min(0.01, { message: 'O valor deve ser maior que 0.' })
  @IsOptional()
  value?: number;

  @IsNotEmpty({ message: 'A data de emissão é obrigatória.' })
  @IsDateString({}, { message: 'A data de emissão deve ser uma data válida.' })
  @IsOptional()
  emissionDate?: string;

  @IsNotEmpty({ message: 'O assignor é obrigatório.' })
  @IsUUID('4', { message: 'O assignor deve ser um UUID válido.' })
  @IsOptional()
  assignor?: string;
}
