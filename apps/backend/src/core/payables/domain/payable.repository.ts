import { Payable } from './payable.aggregate';

export interface PayableRepository {
  findById(id: string): Promise<Payable | null>;
  findAll(): Promise<Payable[]>;
  create(payable: Payable): Promise<Payable>;
  update(payable: Payable): Promise<Payable>;
  delete(id: string): Promise<void>;
}
