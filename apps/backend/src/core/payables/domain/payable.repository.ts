import { Payable } from './payable.aggregate';
import { RepositoryWithEvents } from '../../common/domain/base-repository.interface';

export interface PayableRepository extends RepositoryWithEvents<Payable> {
  findAll(): Promise<Payable[]>;
}
