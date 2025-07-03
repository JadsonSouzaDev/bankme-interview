import {
  PrismaClient,
  Batch as PrismaBatch,
} from '../../../../../generated/prisma';
import { Batch, BatchStatus } from '../../domain/batch.aggregate';
import { BatchRepository } from '../../domain/batch.repository';
import { BaseRepositoryImpl } from '../../../common/infra/database/base-repository.impl';
import { DomainEvent } from '../../../common/domain/domain-event';

const prisma = new PrismaClient();

function toDomain(batch: PrismaBatch): Batch {
  return new Batch({
    id: batch.id,
    status: batch.status as BatchStatus,
    totalItems: batch.totalItems,
    successCount: batch.successCount,
    failedCount: batch.failedCount,
    isActive: batch.isActive,
    createdAt: new Date(batch.createdAt),
    updatedAt: new Date(batch.updatedAt),
  });
}

export class PrismaBatchRepository
  extends BaseRepositoryImpl<Batch>
  implements BatchRepository
{
  async findById(id: string): Promise<Batch | null> {
    return this.findByIdFromDatabase(id);
  }

  async findByStatus(status: string): Promise<Batch[]> {
    const batchesData = await prisma.batch.findMany({
      where: { status, isActive: true },
    });
    return batchesData.map(toDomain);
  }

  async updateProgress(
    id: string,
    successCount: number,
    failedCount: number,
  ): Promise<void> {
    await prisma.batch.update({
      where: { id },
      data: {
        successCount,
        failedCount,
        status: successCount + failedCount === 0 ? 'PENDING' : 'PROCESSING',
        updatedAt: new Date(),
      },
    });
  }

  protected async saveToDatabase(batch: Batch): Promise<Batch> {
    const dto = batch.toDto();
    const data = await prisma.batch.upsert({
      where: { id: dto.id },
      update: {
        status: dto.status,
        totalItems: dto.totalItems,
        successCount: dto.successCount,
        failedCount: dto.failedCount,
        isActive: batch.isActive,
        updatedAt: dto.updatedAt,
      },
      create: {
        id: dto.id,
        status: dto.status,
        totalItems: dto.totalItems,
        successCount: dto.successCount,
        failedCount: dto.failedCount,
        isActive: batch.isActive,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
      },
    });
    return toDomain(data);
  }

  protected async findByIdFromDatabase(id: string): Promise<Batch | null> {
    const data = await prisma.batch.findFirst({
      where: { id, isActive: true },
    });
    if (!data) return null;
    return toDomain(data);
  }

  protected async deleteFromDatabase(id: string): Promise<void> {
    await prisma.batch.update({
      where: { id },
      data: { isActive: false },
    });
  }

  protected getDomainEvents(batch: Batch): DomainEvent[] {
    return batch.getDomainEvents();
  }

  protected clearDomainEvents(batch: Batch): void {
    batch.clearDomainEvents();
  }
}
