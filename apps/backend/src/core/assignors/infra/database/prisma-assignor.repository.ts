import {
  PrismaClient,
  Assignor as PrismaAssignor,
} from '../../../../../generated/prisma';
import { Assignor } from '../../domain/assignor.aggregate';
import { AssignorRepository } from '../../domain/assignor.repository';
import { BaseRepositoryImpl } from '../../../common/infra/database/base-repository.impl';
import { DomainEvent } from '../../../common/domain/domain-event';

const prisma = new PrismaClient();

function toDomain(assignor: PrismaAssignor): Assignor {
  return new Assignor({
    id: assignor.id,
    name: assignor.name,
    email: assignor.email,
    document: assignor.document,
    phone: assignor.phone,
    isActive: true,
    createdAt: new Date(assignor.createdAt),
    updatedAt: new Date(assignor.updatedAt),
  });
}

export class PrismaAssignorRepository
  extends BaseRepositoryImpl<Assignor>
  implements AssignorRepository
{
  async findAll(): Promise<Assignor[]> {
    const list = await prisma.assignor.findMany({
      where: { isActive: true },
    });
    return list.map(toDomain);
  }

  async findByEmail(email: string): Promise<Assignor | null> {
    const data = await prisma.assignor.findFirst({
      where: { email, isActive: true },
    });
    if (!data) return null;
    return toDomain(data);
  }

  async findByDocument(document: string): Promise<Assignor | null> {
    const data = await prisma.assignor.findFirst({
      where: { document, isActive: true },
    });
    if (!data) return null;
    return toDomain(data);
  }

  protected async saveToDatabase(assignor: Assignor): Promise<Assignor> {
    const data = await prisma.assignor.upsert({
      where: { id: assignor.id },
      update: {
        name: assignor.name,
        email: assignor.email,
        document: assignor.document,
        phone: assignor.phone,
        isActive: assignor.isActive,
      },
      create: {
        id: assignor.id,
        name: assignor.name,
        email: assignor.email,
        document: assignor.document,
        phone: assignor.phone,
        isActive: assignor.isActive,
      },
    });
    return toDomain(data);
  }

  protected async findByIdFromDatabase(id: string): Promise<Assignor | null> {
    const data = await prisma.assignor.findFirst({
      where: { id, isActive: true },
    });
    if (!data) return null;
    return toDomain(data);
  }

  protected async deleteFromDatabase(id: string): Promise<void> {
    await prisma.assignor.update({
      where: { id },
      data: { isActive: false },
    });
  }

  protected getDomainEvents(assignor: Assignor): DomainEvent[] {
    return assignor.getDomainEvents();
  }

  protected clearDomainEvents(assignor: Assignor): void {
    assignor.clearDomainEvents();
  }
}
