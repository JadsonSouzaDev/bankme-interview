import { AuthService } from '../../../../core/common/auth/infra/encrypt/auth.service';
import { User } from '../../../../core/common/auth/domain/user.aggregate';
import { TokenDto } from '@bankme/shared';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtService implements AuthService {
  constructor(private jwt: NestJwtService) {}

  async signIn(user: User, encryptedPassword: string): Promise<TokenDto> {
    const isPasswordValid = await bcrypt.compare(
      encryptedPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.login };
    return {
      accessToken: await this.jwt.signAsync(payload, { expiresIn: '1m' }),
      expiresIn: 60,
    };
  }

  async encrypt(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
