import { Module } from '@nestjs/common';
import { AssignorsIntegrationController } from './controllers/assignors.controller';
import {
  AssignorRepositoryProvider,
  ApplicationServiceProvider,
  CreateAssignorCommandProvider,
  GetAssignorQueryProvider,
  GetAllAssignorsQueryProvider,
  UpdateAssignorCommandProvider,
  DeleteAssignorCommandProvider,
} from './assignors.providers';

@Module({
  controllers: [AssignorsIntegrationController],
  providers: [
    AssignorRepositoryProvider,
    ApplicationServiceProvider,
    CreateAssignorCommandProvider,
    GetAssignorQueryProvider,
    GetAllAssignorsQueryProvider,
    UpdateAssignorCommandProvider,
    DeleteAssignorCommandProvider,
  ],
})
export class AssignorsModule {}
