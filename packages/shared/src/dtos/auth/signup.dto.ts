import { IsString, IsNotEmpty, Matches, MinLength, MaxLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Login deve ter pelo menos 3 caracteres' })
  @MaxLength(20, { message: 'Login deve ter no máximo 20 caracteres' })
  @Matches(/^[a-zA-Z0-9]+$/, { 
    message: 'Login deve conter apenas letras e números, sem espaços' 
  })
  login: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;
}