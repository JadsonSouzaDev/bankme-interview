import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PayablesModule } from './nest/payables/payables.module';

@Module({
  imports: [PayablesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
