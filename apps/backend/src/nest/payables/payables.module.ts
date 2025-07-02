import { Module } from '@nestjs/common';
import { PayablesIntegrationController } from './controllers/payables.controller';

@Module({
  controllers: [PayablesIntegrationController],
  providers: [],
})
export class PayablesModule {}
