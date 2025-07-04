import { LoginDto, SignupDto, TokenDto, UserDto } from '@bankme/shared';
import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SignupCommand } from '../../../../core/common/auth/application/commands/signup/signup.command';
import { LOGIN_COMMAND, SIGNUP_COMMAND } from '../auth.providers';
import { LoginCommand } from '../../../../core/common/auth/application/commands/login/login.command';
import { Public } from '../decorators/public.decorator';

@ApiTags('auth')
@Controller('integrations/auth')
export class AuthController {
  constructor(
    @Inject(SIGNUP_COMMAND)
    private readonly signupCommand: SignupCommand,

    @Inject(LOGIN_COMMAND)
    private readonly loginCommand: LoginCommand,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login',
    description: 'Authenticates a user and returns a JWT token',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login data',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: TokenDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
    return this.loginCommand.execute(loginDto);
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create account',
    description: 'Creates a new user account',
  })
  @ApiBody({
    type: SignupDto,
    description: 'Data for creating the account',
  })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or email already exists',
  })
  async signup(@Body() signupDto: SignupDto): Promise<UserDto> {
    return this.signupCommand.execute(signupDto);
  }
}
