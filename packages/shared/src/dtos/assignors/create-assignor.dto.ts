import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateAssignorDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(140)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(140)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(30)
  document: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(20)
  phone: string;
} 