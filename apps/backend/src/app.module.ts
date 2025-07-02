import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PayablesModule } from './nest/payables/payables.module';
import { AssignorsModule } from './nest/assignors/assignors.module';
import { AuthModule } from './nest/common/auth/auth.module';

@Module({
  imports: [PayablesModule, AssignorsModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
