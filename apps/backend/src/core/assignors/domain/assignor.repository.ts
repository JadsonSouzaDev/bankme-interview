import { Assignor } from './assignor.aggregate';

export interface AssignorRepository {
  findById(id: string): Promise<Assignor | null>;
  findAll(): Promise<Assignor[]>;
  create(assignor: Assignor): Promise<Assignor>;
  update(assignor: Assignor): Promise<Assignor>;
  delete(id: string): Promise<void>;
}
