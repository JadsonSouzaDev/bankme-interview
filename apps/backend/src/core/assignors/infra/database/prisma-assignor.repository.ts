import {
  PrismaClient,
  Assignor as PrismaAssignor,
} from '../../../../../generated/prisma';
import { Assignor } from '../../domain/assignor.aggregate';
import { AssignorRepository } from '../../../assignors/domain/assignor.repository';

const prisma = new PrismaClient();

function toDomain(assignor: PrismaAssignor): Assignor {
  return new Assignor({
    id: assignor.id,
    document: assignor.document,
    email: assignor.email,
    phone: assignor.phone,
    name: assignor.name,
  });
}

export class PrismaAssignorRepository implements AssignorRepository {
  async findById(id: string): Promise<Assignor | null> {
    const data = await prisma.assignor.findUnique({ where: { id } });
    if (!data) return null;
    return toDomain(data);
  }

  async findAll(): Promise<Assignor[]> {
    const list = await prisma.assignor.findMany();
    return list.map(toDomain);
  }

  async create(assignor: Assignor): Promise<Assignor> {
    const data = await prisma.assignor.create({
      data: {
        document: assignor.document,
        email: assignor.email,
        phone: assignor.phone,
        name: assignor.name,
      },
    });
    return toDomain(data);
  }

  async update(assignor: Assignor): Promise<Assignor> {
    const data = await prisma.assignor.update({
      where: { id: assignor.id },
      data: {
        document: assignor.document,
        email: assignor.email,
        phone: assignor.phone,
        name: assignor.name,
      },
    });
    return toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await prisma.assignor.delete({ where: { id } });
  }
}
