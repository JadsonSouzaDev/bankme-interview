import { TokenDto } from '@bankme/shared';
import { BaseCommand } from 'src/core/common/application/commands/base-command.interface';
import { UserRepository } from '../../../domain/user.repository';
import { ApplicationService } from 'src/core/common/application/application-service.interface';
import { NotFoundException } from '@nestjs/common';
import { AuthService } from '../../../infra/encrypt/auth.service';

export interface LoginCommandInput {
  login: string;
  password: string;
}

export class LoginCommand implements BaseCommand<LoginCommandInput, TokenDto> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(dto: LoginCommandInput): Promise<TokenDto> {
    return this.applicationService.execute(async () => {
      const user = await this.userRepository.findByLogin(dto.login);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await this.authService.signIn(user, dto.password);
    });
  }
}
