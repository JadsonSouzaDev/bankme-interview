import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  CreatePayableCommand,
  CreatePayableCommandInput,
} from '../../../core/payables/application/commands/create-payable/create-payable.command';
import { UpdateBatchProgressCommand } from '../../../core/payables/application/commands/update-batch-progress/update-batch-progress.command';
import { Logger } from '@nestjs/common';

@Processor('payables', {
  concurrency: 1,
})
export class PayableConsumer extends WorkerHost {
  private readonly logger = new Logger(PayableConsumer.name);

  constructor(
    private readonly createPayableCommand: CreatePayableCommand,
    private readonly updateBatchProgressCommand: UpdateBatchProgressCommand,
  ) {
    super();
  }

  async process(
    job: Job<CreatePayableCommandInput, any, string>,
  ): Promise<any> {
    const attemptNumber = job.attemptsMade + 1;
    const maxAttempts = job.opts.attempts || 1;

    try {
      const result = await this.createPayableCommand.execute(job.data);
      if (job.data.batchId) {
        await this.updateBatchSuccess(job.data.batchId);
      }

      return result;
    } catch (error) {
      this.logger.error(
        `Error on create payable. Attempt ${attemptNumber}: ${(error as Error).message}`,
      );

      if (job.data.batchId && attemptNumber >= maxAttempts) {
        await this.updateBatchFailure(
          job.data.batchId,
          job,
          (error as Error).message,
        );
      }
      throw error;
    }
  }

  private async updateBatchSuccess(batchId: string): Promise<void> {
    try {
      await this.updateBatchProgressCommand.execute({
        batchId,
        payableStatus: 'success',
      });
    } catch (error) {
      this.logger.error('Error updating batch progress (success):', error);
    }
  }

  private async updateBatchFailure(
    batchId: string,
    job: Job<CreatePayableCommandInput, any, string>,
    errorMessage: string,
  ): Promise<void> {
    try {
      await this.updateBatchProgressCommand.execute({
        batchId,
        payableStatus: 'failed',
        payload: {
          ...job.data,
          errorMessage,
        },
      });
    } catch (error) {
      this.logger.error('Error updating batch progress (failure):', error);
    }
  }
}
