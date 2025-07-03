import { PayableBatchDto } from '@bankme/shared';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { BaseCommand } from '../../../../common/application/commands/base-command.interface';
import { Queue } from 'bullmq';
import { Batch } from '../../../domain/batch.aggregate';
import { BatchRepository } from '../../../domain/batch.repository';

export interface CreatePayablesBatchCommandInput {
  payables: {
    value: number;
    emissionDate: Date;
    assignor: string;
  }[];
  batchName?: string;
  batchDescription?: string;
}

export class CreatePayablesBatchCommand
  implements BaseCommand<CreatePayablesBatchCommandInput, PayableBatchDto>
{
  constructor(
    private readonly payableQueue: Queue,
    private readonly batchRepository: BatchRepository,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(
    input: CreatePayablesBatchCommandInput,
  ): Promise<PayableBatchDto> {
    return this.applicationService.execute(async () => {
      const batch = Batch.create({
        name: input.batchName,
        description: input.batchDescription,
        totalItems: input.payables.length,
      });

      batch.startProcessing();
      await this.batchRepository.save(batch);

      for (const payable of input.payables) {
        await this.payableQueue.add(
          'create-payable',
          {
            ...payable,
            assignorId: payable.assignor,
            batchId: batch.id,
          },
          {
            attempts: 4,
            backoff: {
              type: 'exponential',
              delay: 1000,
            },
            removeOnComplete: 100,
            removeOnFail: 50,
          },
        );
      }

      return new PayableBatchDto({
        batchId: batch.id,
        total: input.payables.length,
        success: 0,
        failed: 0,
      });
    });
  }
}
