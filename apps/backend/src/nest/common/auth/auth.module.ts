import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import {
  ApplicationServiceProvider,
  AuthServiceProvider,
  LoginCommandProvider,
  SignupCommandProvider,
  UserRepositoryProvider,
} from './auth.providers';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    ApplicationServiceProvider,
    AuthServiceProvider,
    UserRepositoryProvider,
    SignupCommandProvider,
    LoginCommandProvider,
  ],
})
export class AuthModule {}
