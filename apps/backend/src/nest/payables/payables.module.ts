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
} from './payables.providers';

@Module({
  controllers: [PayablesIntegrationController],
  providers: [
    PayableRepositoryProvider,
    AssignorRepositoryProvider,
    ApplicationServiceProvider,
    CreatePayableCommandProvider,
    GetPayableQueryProvider,
    GetAllPayablesQueryProvider,
    UpdatePayableCommandProvider,
    DeletePayableCommandProvider,
  ],
})
export class PayablesModule {}
