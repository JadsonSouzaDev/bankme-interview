import { IsString, IsNotEmpty, Matches, MinLength, MaxLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Login must have at least 3 characters' })
  @MaxLength(20, { message: 'Login must have at most 20 characters' })
  @Matches(/^[a-zA-Z0-9]+$/, { 
    message: 'Login must contain only letters and numbers, without spaces' 
  })
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  password: string;
} 