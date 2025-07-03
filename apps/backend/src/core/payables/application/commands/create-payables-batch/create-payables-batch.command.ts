import { PayableBatchDto } from '@bankme/shared';
import { ApplicationService } from 'src/core/common/application/application-service.interface';
import { BaseCommand } from 'src/core/common/application/commands/base-command.interface';
import { Queue } from 'bullmq';

export interface CreatePayablesBatchCommandInput {
  payables: {
    value: number;
    emissionDate: Date;
    assignor: string;
  }[];
}

export class CreatePayablesBatchCommand
  implements BaseCommand<CreatePayablesBatchCommandInput, PayableBatchDto>
{
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly payableQueue: Queue,
  ) {}

  async execute(
    input: CreatePayablesBatchCommandInput,
  ): Promise<PayableBatchDto> {
    return this.applicationService.execute(async () => {
      for (const payable of input.payables) {
        await this.payableQueue.add(
          'create-payable',
          {
            ...payable,
            assignorId: payable.assignor,
          },
          {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 1000,
            },
          },
        );
      }

      return new PayableBatchDto({
        batchId: '123',
        total: input.payables.length,
        success: 0,
        failed: 0,
      });
    });
  }
}
