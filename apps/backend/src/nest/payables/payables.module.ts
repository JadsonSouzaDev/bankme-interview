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
} from './payables.providers';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'payables',
    }),
  ],
  controllers: [PayablesIntegrationController],
  providers: [
    PayableRepositoryProvider,
    PayableQueueProvider,
    AssignorRepositoryProvider,
    ApplicationServiceProvider,
    CreatePayableCommandProvider,
    CreatePayablesBatchCommandProvider,
    GetPayableQueryProvider,
    GetAllPayablesQueryProvider,
    UpdatePayableCommandProvider,
    DeletePayableCommandProvider,
    PayableConsumerProvider,
  ],
})
export class PayablesModule {}
