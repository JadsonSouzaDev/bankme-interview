import { TokenDto } from '@bankme/shared';
import { User } from '../../domain/user.aggregate';

export interface AuthService {
  signIn(user: User, encryptedPassword: string): Promise<TokenDto>;
  encrypt(password: string): Promise<string>;
}
