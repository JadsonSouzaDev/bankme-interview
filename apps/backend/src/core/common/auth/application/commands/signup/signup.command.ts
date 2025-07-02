import { UserDto } from '@bankme/shared';
import { BaseCommand } from '../../../../../../core/common/application/commands/base-command.interface';
import { UserRepository } from '../../../domain/user.repository';
import { ApplicationService } from '../../../../../common/application/application-service.interface';
import { BadRequestException } from '@nestjs/common';
import { User } from '../../../domain/user.aggregate';
import { AuthService } from '../../../infra/encrypt/auth.service';

export interface SignupCommandInput {
  login: string;
  password: string;
}

export class SignupCommand implements BaseCommand<SignupCommandInput, UserDto> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(dto: SignupCommandInput): Promise<UserDto> {
    return this.applicationService.execute(async () => {
      const existingUser = await this.userRepository.findByLogin(dto.login);
      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      const hashedPassword = await this.authService.encrypt(dto.password);

      const user = User.create({
        login: dto.login,
        password: hashedPassword,
      });
      const savedUser = await this.userRepository.save(user);
      return savedUser.toDto();
    });
  }
}
