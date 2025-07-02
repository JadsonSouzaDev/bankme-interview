import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PayablesModule } from './nest/payables/payables.module';
import { AssignorsModule } from './nest/assignors/assignors.module';

@Module({
  imports: [PayablesModule, AssignorsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
