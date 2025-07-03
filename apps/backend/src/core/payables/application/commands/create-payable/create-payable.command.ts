import { BadRequestException } from '@nestjs/common';
import { Payable } from '../../../domain/payable.aggregate';
import { PayableRepository } from '../../../domain/payable.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { AssignorRepository } from '../../../../assignors/domain/assignor.repository';
import { BaseCommand } from '../../../../../core/common/application/commands/base-command.interface';
import { PayableDto } from '@bankme/shared';

export interface CreatePayableCommandInput {
  value: number;
  emissionDate: Date;
  assignor: string;
  batchId?: string;
}

export class CreatePayableCommand
  implements BaseCommand<CreatePayableCommandInput, PayableDto>
{
  constructor(
    private readonly payableRepository: PayableRepository,
    private readonly assignorRepository: AssignorRepository,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(input: CreatePayableCommandInput): Promise<PayableDto> {
    return this.applicationService.execute(async () => {
      const assignor = await this.assignorRepository.findById(input.assignor);
      if (!assignor) {
        throw new BadRequestException('Assignor not found');
      }

      const payable = Payable.create({
        value: input.value,
        emissionDate: new Date(input.emissionDate),
        assignorId: assignor.id,
        batchId: input.batchId,
      });

      const savedPayable = await this.payableRepository.save(payable);
      return savedPayable.toDto();
    });
  }
}
