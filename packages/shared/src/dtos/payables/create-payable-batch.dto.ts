import {
  IsArray,
  IsNotEmpty,
  ArrayMaxSize,
  ValidateNested,
} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { CreatePayableDto } from "./create-payable.dto";
import { Type } from "class-transformer";

export class CreatePayableBatchDto {
  @ApiProperty({
    description: 'List of payables to be created',
    type: [CreatePayableDto],
    maxItems: 10000,
    minItems: 1,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePayableDto)
  @ArrayMaxSize(10000, {
    message: "Batch must contain less than 10000 payables",
  })
  @IsNotEmpty({
    message: "Batch must contain at least one payable",
  })
  payables: CreatePayableDto[];
}
