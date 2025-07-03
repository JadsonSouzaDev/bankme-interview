import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PayablesModule } from './nest/payables/payables.module';
import { AssignorsModule } from './nest/assignors/assignors.module';
import { AuthModule } from './nest/common/auth/auth.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      },
    }),
    PayablesModule,
    AssignorsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
