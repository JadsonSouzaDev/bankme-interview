import { Module } from '@nestjs/common';
import { PayablesIntegrationController } from './controllers/payables.controller';
import {
  PayableRepositoryProvider,
  AssignorRepositoryProvider,
  ApplicationServiceProvider,
  CreatePayableCommandProvider,
  GetPayableQueryProvider,
  GetAllPayablesQueryProvider,
  UpdatePayableCommandProvider,
  DeletePayableCommandProvider,
  CreatePayablesBatchCommandProvider,
  PayableQueueProvider,
  PayableConsumerProvider,
  BatchRepositoryProvider,
  UpdateBatchProgressCommandProvider,
  DeadLetterQueueProvider,
} from './payables.providers';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'payables',
    }),
    BullModule.registerQueue({
      name: 'dead-letter',
    }),
  ],
  controllers: [PayablesIntegrationController],
  providers: [
    PayableRepositoryProvider,
    AssignorRepositoryProvider,
    BatchRepositoryProvider,
    PayableQueueProvider,
    DeadLetterQueueProvider,
    ApplicationServiceProvider,
    CreatePayableCommandProvider,
    CreatePayablesBatchCommandProvider,
    GetPayableQueryProvider,
    GetAllPayablesQueryProvider,
    UpdatePayableCommandProvider,
    UpdateBatchProgressCommandProvider,
    DeletePayableCommandProvider,
    PayableConsumerProvider,
  ],
})
export class PayablesModule {}
