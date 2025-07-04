import { IsString, IsNotEmpty, MinLength, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username for login',
    example: 'user123',
    minLength: 3,
    maxLength: 20,
    pattern: '^[a-zA-Z0-9]+$',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Login must have at least 3 characters' })
  @MaxLength(20, { message: 'Login must have at most 20 characters' })
  @Matches(/^[a-zA-Z0-9]+$/, { 
    message: 'Login must contain only letters and numbers, without spaces' 
  })
  login: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  password: string;
}