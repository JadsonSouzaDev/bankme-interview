import {
  PrismaClient,
  Payable as PrismaPayable,
} from '../../../../../generated/prisma';
import { Payable } from '../../domain/payable.aggregate';
import { PayableRepository } from '../../domain/payable.repository';
import { BaseRepositoryImpl } from '../../../common/infra/database/base-repository.impl';
import { DomainEvent } from '../../../common/domain/domain-event';

const prisma = new PrismaClient();

function toDomain(payable: PrismaPayable): Payable {
  return new Payable({
    id: payable.id,
    value: payable.value,
    emissionDate: payable.emissionDate,
    assignorId: payable.assignorId,
    isActive: true,
    createdAt: new Date(payable.createdAt),
    updatedAt: new Date(payable.updatedAt),
  });
}

export class PrismaPayableRepository
  extends BaseRepositoryImpl<Payable>
  implements PayableRepository
{
  async findAll(): Promise<Payable[]> {
    const list = await prisma.payable.findMany({
      where: { isActive: true },
    });
    return list.map(toDomain);
  }

  protected async saveToDatabase(payable: Payable): Promise<Payable> {
    const data = await prisma.payable.upsert({
      where: { id: payable.id },
      update: {
        value: payable.value,
        emissionDate: payable.emissionDate,
        assignorId: payable.assignorId,
        isActive: payable.isActive,
      },
      create: {
        id: payable.id,
        value: payable.value,
        emissionDate: payable.emissionDate,
        assignorId: payable.assignorId,
        isActive: payable.isActive,
      },
    });
    return toDomain(data);
  }

  protected async findByIdFromDatabase(id: string): Promise<Payable | null> {
    const data = await prisma.payable.findFirst({
      where: { id, isActive: true },
    });
    if (!data) return null;
    return toDomain(data);
  }

  protected async deleteFromDatabase(id: string): Promise<void> {
    await prisma.payable.update({
      where: { id },
      data: { isActive: false },
    });
  }

  protected getDomainEvents(payable: Payable): DomainEvent[] {
    return payable.getDomainEvents();
  }

  protected clearDomainEvents(payable: Payable): void {
    payable.clearDomainEvents();
  }
}
