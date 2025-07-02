import { BadRequestException } from '@nestjs/common';
import { Payable } from '../../../domain/payable.aggregate';
import { PayableRepository } from '../../../domain/payable.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { AssignorRepository } from '../../../../assignors/domain/assignor.repository';
import { BaseCommand } from '../../../../../core/common/application/commands/base-command.interface';

export interface CreatePayableCommandInput {
  value: number;
  emissionDate: string;
  assignor: string;
}

export class CreatePayableCommand
  implements BaseCommand<CreatePayableCommandInput, Payable>
{
  constructor(
    private readonly payableRepository: PayableRepository,
    private readonly assignorRepository: AssignorRepository,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(dto: CreatePayableCommandInput): Promise<Payable> {
    return this.applicationService.execute(async () => {
      const assignor = await this.assignorRepository.findById(dto.assignor);
      if (!assignor) {
        throw new BadRequestException('Assignor not found');
      }

      const payable = Payable.create({
        value: dto.value,
        emissionDate: new Date(dto.emissionDate),
        assignorId: assignor.id,
      });

      return this.payableRepository.save(payable);
    });
  }
}
