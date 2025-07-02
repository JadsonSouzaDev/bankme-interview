import { Assignor } from './assignor.aggregate';
import { RepositoryWithEvents } from '../../common/domain/base-repository.interface';

export interface AssignorRepository extends RepositoryWithEvents<Assignor> {
  findAll(): Promise<Assignor[]>;
  findByEmail(email: string): Promise<Assignor | null>;
  findByDocument(document: string): Promise<Assignor | null>;
}
