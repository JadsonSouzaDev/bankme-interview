import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignorDto {
  @ApiProperty({
    description: 'Full name of the assignor',
    example: 'John Doe',
    minLength: 2,
    maxLength: 140,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(140)
  name: string;

  @ApiProperty({
    description: 'Email of the assignor',
    example: 'john.doe@email.com',
    maxLength: 140,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(140)
  email: string;

  @ApiProperty({
    description: 'Document of the assignor',
    example: '123.456.789-00',
    minLength: 7,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(30)
  document: string;

  @ApiProperty({
    description: 'Phone of the assignor',
    example: '(11) 99999-9999',
    minLength: 10,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(20)
  phone: string;
} 