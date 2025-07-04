import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PayableRepository } from '../../../domain/payable.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { AssignorRepository } from '../../../../assignors/domain/assignor.repository';
import { BaseCommand } from '../../../../../core/common/application/commands/base-command.interface';
import { PayableDto } from '@bankme/shared';

export interface UpdatePayableCommandInput {
  id: string;
  value?: number;
  emissionDate?: Date;
  assignor?: string;
}

export class UpdatePayableCommand
  implements BaseCommand<UpdatePayableCommandInput, PayableDto>
{
  constructor(
    private readonly payableRepository: PayableRepository,
    private readonly assignorRepository: AssignorRepository,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(input: UpdatePayableCommandInput): Promise<PayableDto> {
    return this.applicationService.execute(async () => {
      const payable = await this.payableRepository.findById(input.id);
      if (!payable) {
        throw new NotFoundException('Payable not found');
      }

      const updates: {
        value?: number;
        emissionDate?: Date;
        assignorId?: string;
      } = {};

      if (input.value !== undefined) {
        updates.value = input.value;
      }

      if (input.emissionDate) {
        updates.emissionDate = new Date(input.emissionDate);
      }

      if (input.assignor) {
        const assignor = await this.assignorRepository.findById(input.assignor);
        if (!assignor) {
          throw new BadRequestException('Assignor not found');
        }
        updates.assignorId = assignor.id;
      }

      payable.updateMultipleFields(updates);

      const savedPayable = await this.payableRepository.save(payable);
      return savedPayable.toDto();
    });
  }
}
