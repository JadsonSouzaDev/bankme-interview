import { Queue } from 'bullmq';
import { ApplicationService } from '../../../../common/application/application-service.interface';
import { BaseCommand } from '../../../../common/application/commands/base-command.interface';
import { BatchRepository } from '../../../domain/batch.repository';
import { CreatePayableCommandInput } from '../create-payable/create-payable.command';
import { NotFoundException } from '@nestjs/common';

export interface UpdateBatchProgressCommandInput {
  batchId: string;
  payableStatus: 'success' | 'failed';
  payload?: CreatePayableCommandInput & {
    errorMessage: string;
  };
}

export class UpdateBatchProgressCommand
  implements BaseCommand<UpdateBatchProgressCommandInput, void>
{
  constructor(
    private readonly deadLetterQueue: Queue,
    private readonly batchRepository: BatchRepository,
    private readonly applicationService: ApplicationService,
  ) {}

  async execute(input: UpdateBatchProgressCommandInput): Promise<void> {
    return this.applicationService.execute(async () => {
      const batch = await this.batchRepository.findById(input.batchId);

      if (!batch) {
        throw new NotFoundException(`Batch with ID ${input.batchId} not found`);
      }

      if (input.payableStatus === 'success') {
        batch.incrementSuccess();
      } else {
        batch.incrementFailed({
          value: input.payload!.value,
          emissionDate: input.payload!.emissionDate,
          assignorId: input.payload!.assignor,
          errorMessage: input.payload!.errorMessage,
        });
        await this.deadLetterQueue.add(
          'failed-payable',
          {
            ...input.payload,
          },
          {
            attempts: 4,
            backoff: { type: 'exponential', delay: 1000 },
            removeOnComplete: 100,
            removeOnFail: 50,
          },
        );
      }

      batch.updateProgress(batch.successCount, batch.failedCount);

      await this.batchRepository.save(batch);
    });
  }
}
