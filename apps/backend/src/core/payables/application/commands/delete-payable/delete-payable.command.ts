import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PayableRepository } from '../../../domain/payable.repository';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { BaseCommand } from '../../../../../core/common/application/commands/base-command.interface';

export interface DeletePayableCommandInput {
  id: string;
}

export interface DeletePayableCommandOutput {
  success: boolean;
  message: string;
}

export class DeletePayableCommand
  implements BaseCommand<DeletePayableCommandInput, DeletePayableCommandOutput>
{
  constructor(
    private readonly payableRepository: PayableRepository,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(
    dto: DeletePayableCommandInput,
  ): Promise<DeletePayableCommandOutput> {
    return this.applicationService.execute(async () => {
      const { id } = dto;

      const payable = await this.payableRepository.findById(id);

      if (!payable) {
        throw new NotFoundException('Payable not found');
      }

      if (!payable.isActive) {
        throw new BadRequestException('Payable already deleted');
      }

      payable.deactivate();
      await this.payableRepository.save(payable);

      return {
        success: true,
        message: 'Payable deleted successfully',
      };
    });
  }
}
