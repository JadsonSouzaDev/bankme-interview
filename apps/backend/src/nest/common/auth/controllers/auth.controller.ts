import { LoginDto, SignupDto, TokenDto, UserDto } from '@bankme/shared';
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { SignupCommand } from '../../../../core/common/auth/application/commands/signup/signup.command';
import { LOGIN_COMMAND, SIGNUP_COMMAND } from '../auth.providers';
import { LoginCommand } from '../../../../core/common/auth/application/commands/login/login.command';

@Controller('integrations/auth')
export class AuthController {
  constructor(
    @Inject(SIGNUP_COMMAND)
    private readonly signupCommand: SignupCommand,

    @Inject(LOGIN_COMMAND)
    private readonly loginCommand: LoginCommand,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    return this.loginCommand.execute(loginDto);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto): Promise<UserDto> {
    return this.signupCommand.execute(signupDto);
  }
}
