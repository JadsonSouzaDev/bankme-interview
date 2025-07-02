import { PrismaClient } from '../../../../../../generated/prisma';
import type { User as PrismaUser } from '../../../../../../generated/prisma';
import { UserRepository } from '../../domain/user.repository';
import { User } from '../../domain/user.aggregate';
import { BaseRepositoryImpl } from '../../../../common/infra/database/base-repository.impl';
import { DomainEvent } from '../../../../common/domain/domain-event';

const prisma = new PrismaClient();

function toDomain(user: PrismaUser): User {
  return new User({
    id: user.id,
    login: user.login,
    password: user.password,
    isActive: user.isActive,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  });
}

export class PrismaUserRepository
  extends BaseRepositoryImpl<User>
  implements UserRepository
{
  protected async saveToDatabase(user: User): Promise<User> {
    const data = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        login: user.login,
        password: user.password,
        isActive: user.isActive,
      },
      create: {
        id: user.id,
        login: user.login,
        password: user.password,
        isActive: user.isActive,
      },
    });
    return toDomain(data);
  }

  protected async findByIdFromDatabase(id: string): Promise<User | null> {
    const user = await prisma.user.findFirst({ where: { id, isActive: true } });
    if (!user) return null;
    return toDomain(user);
  }

  async findByLogin(login: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: { login, isActive: true },
    });
    if (!user) return null;
    return toDomain(user);
  }

  protected async deleteFromDatabase(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  protected getDomainEvents(user: User): DomainEvent[] {
    return user.getDomainEvents();
  }

  protected clearDomainEvents(user: User): void {
    user.clearDomainEvents();
  }
}
