import { Provider } from '@nestjs/common';
import { SignupCommand } from '../../../core/common/auth/application/commands/signup/signup.command';
import { ApplicationServiceImpl } from '../../../core/common/application/application-service.impl';
import { PrismaUserRepository } from '../../../core/common/auth/infra/database/prisma-user.repository';
import { EventBusImpl } from '../../../core/common/application/events/event-bus.impl';
import { LoginCommand } from '../../../core/common/auth/application/commands/login/login.command';
import { JwtService } from './jwt/jwt.service';

// Tokens
export const APPLICATION_SERVICE = 'APPLICATION_SERVICE';
export const AUTH_SERVICE = 'AUTH_SERVICE';
export const USER_REPOSITORY = 'USER_REPOSITORY';
export const SIGNUP_COMMAND = 'SIGNUP_COMMAND';
export const LOGIN_COMMAND = 'LOGIN_COMMAND';

// Application Service Provider
export const ApplicationServiceProvider: Provider = {
  provide: APPLICATION_SERVICE,
  useClass: ApplicationServiceImpl,
};

// Auth Service Provider
export const AuthServiceProvider: Provider = {
  provide: AUTH_SERVICE,
  useClass: JwtService,
};

// User Repository Provider
export const UserRepositoryProvider: Provider = {
  provide: USER_REPOSITORY,
  useFactory: () => {
    const repository = new PrismaUserRepository();
    const eventBus = new EventBusImpl();
    repository.setEventPublisher(eventBus);
    return repository;
  },
};

// Command Providers
export const SignupCommandProvider: Provider = {
  provide: SIGNUP_COMMAND,
  useFactory: (userRepository, authService, applicationService) => {
    return new SignupCommand(userRepository, authService, applicationService);
  },
  inject: [USER_REPOSITORY, AUTH_SERVICE, APPLICATION_SERVICE],
};

export const LoginCommandProvider: Provider = {
  provide: LOGIN_COMMAND,
  useFactory: (userRepository, authService, applicationService) => {
    return new LoginCommand(userRepository, authService, applicationService);
  },
  inject: [USER_REPOSITORY, AUTH_SERVICE, APPLICATION_SERVICE],
};
