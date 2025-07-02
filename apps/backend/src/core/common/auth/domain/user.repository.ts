import { User } from './user.aggregate';
import { RepositoryWithEvents } from '../../../common/domain/base-repository.interface';

export interface UserRepository extends RepositoryWithEvents<User> {
  findByLogin(login: string): Promise<User | null>;
}
