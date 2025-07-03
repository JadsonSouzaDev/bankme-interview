import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  CreatePayableCommand,
  CreatePayableCommandInput,
} from '../../../core/payables/application/commands/create-payable/create-payable.command';

@Processor('payables')
export class PayableConsumer extends WorkerHost {
  constructor(private readonly createPayableCommand: CreatePayableCommand) {
    super();
  }

  async process(
    job: Job<CreatePayableCommandInput, any, string>,
  ): Promise<any> {
    return this.createPayableCommand.execute(job.data);
  }
}
