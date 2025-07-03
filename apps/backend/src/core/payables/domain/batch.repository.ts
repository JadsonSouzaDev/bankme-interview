import { BaseRepository } from '../../common/domain/base-repository.interface';
import { Batch } from './batch.aggregate';

export interface BatchRepository extends BaseRepository<Batch> {
  findById(id: string): Promise<Batch | null>;
  findByStatus(status: string): Promise<Batch[]>;
  updateProgress(
    id: string,
    successCount: number,
    failedCount: number,
  ): Promise<void>;
}
