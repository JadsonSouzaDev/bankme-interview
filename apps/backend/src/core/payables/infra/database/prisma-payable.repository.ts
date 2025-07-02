import {
  PrismaClient,
  Payable as PrismaPayable,
} from '../../../../../generated/prisma';
import { Payable } from '../../domain/payable.aggregate';
import { PayableRepository } from '../../../payables/domain/payable.repository';

const prisma = new PrismaClient();

function toDomain(payable: PrismaPayable): Payable {
  return new Payable({
    id: payable.id,
    value: payable.value,
    emissionDate: payable.emissionDate,
    assignorId: payable.assignorId,
  });
}

export class PrismaPayableRepository implements PayableRepository {
  async findById(id: string): Promise<Payable | null> {
    const data = await prisma.payable.findUnique({ where: { id } });
    if (!data) return null;
    return toDomain(data);
  }

  async findAll(): Promise<Payable[]> {
    const list = await prisma.payable.findMany();
    return list.map(toDomain);
  }

  async create(payable: Payable): Promise<Payable> {
    const data = await prisma.payable.create({
      data: {
        value: payable.value,
        emissionDate: payable.emissionDate,
        assignorId: payable.assignorId,
      },
    });
    return toDomain(data);
  }

  async update(payable: Payable): Promise<Payable> {
    const data = await prisma.payable.update({
      where: { id: payable.id },
      data: {
        value: payable.value,
        emissionDate: payable.emissionDate,
        assignorId: payable.assignorId,
      },
    });
    return toDomain(data);
  }

  async delete(id: string): Promise<void> {
    await prisma.payable.delete({ where: { id } });
  }
}
