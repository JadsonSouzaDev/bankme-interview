import { Provider } from '@nestjs/common';
import { CreateAssignorCommand } from '../../core/assignors/application/commands/create-assignor/create-assignor.command';
import { UpdateAssignorCommand } from '../../core/assignors/application/commands/update-assignor/update-assignor.command';
import { DeleteAssignorCommand } from '../../core/assignors/application/commands/delete-assignor/delete-assignor.command';
import { GetAssignorQuery } from '../../core/assignors/application/queries/get-assignor/get-assignor.query';
import { GetAllAssignorsQuery } from '../../core/assignors/application/queries/get-all-assignors/get-all-assignors.query';
import { ApplicationServiceImpl } from '../../core/common/application/application-service.impl';
import { PrismaAssignorRepository } from '../../core/assignors/infra/database/prisma-assignor.repository';
import { EventBusImpl } from '../../core/common/application/events/event-bus.impl';

// Tokens
export const APPLICATION_SERVICE = 'APPLICATION_SERVICE';
export const ASSIGNOR_REPOSITORY = 'ASSIGNOR_REPOSITORY';
export const CREATE_ASSIGNOR_COMMAND = 'CREATE_ASSIGNOR_COMMAND';
export const UPDATE_ASSIGNOR_COMMAND = 'UPDATE_ASSIGNOR_COMMAND';
export const DELETE_ASSIGNOR_COMMAND = 'DELETE_ASSIGNOR_COMMAND';
export const GET_ASSIGNOR_QUERY = 'GET_ASSIGNOR_QUERY';
export const GET_ALL_ASSIGNORS_QUERY = 'GET_ALL_ASSIGNORS_QUERY';

// Application Service Provider
export const ApplicationServiceProvider: Provider = {
  provide: APPLICATION_SERVICE,
  useClass: ApplicationServiceImpl,
};

// Repository Provider
export const AssignorRepositoryProvider: Provider = {
  provide: ASSIGNOR_REPOSITORY,
  useFactory: () => {
    const repository = new PrismaAssignorRepository();
    const eventBus = new EventBusImpl();
    repository.setEventPublisher(eventBus);
    return repository;
  },
};

// Command Providers
export const CreateAssignorCommandProvider: Provider = {
  provide: CREATE_ASSIGNOR_COMMAND,
  useFactory: (assignorRepository, applicationService) => {
    return new CreateAssignorCommand(assignorRepository, applicationService);
  },
  inject: [ASSIGNOR_REPOSITORY, APPLICATION_SERVICE],
};

export const UpdateAssignorCommandProvider: Provider = {
  provide: UPDATE_ASSIGNOR_COMMAND,
  useFactory: (assignorRepository, applicationService) => {
    return new UpdateAssignorCommand(assignorRepository, applicationService);
  },
  inject: [ASSIGNOR_REPOSITORY, APPLICATION_SERVICE],
};

export const DeleteAssignorCommandProvider: Provider = {
  provide: DELETE_ASSIGNOR_COMMAND,
  useFactory: (assignorRepository, applicationService) => {
    return new DeleteAssignorCommand(assignorRepository, applicationService);
  },
  inject: [ASSIGNOR_REPOSITORY, APPLICATION_SERVICE],
};

// Query Providers
export const GetAssignorQueryProvider: Provider = {
  provide: GET_ASSIGNOR_QUERY,
  useFactory: (assignorRepository, applicationService) => {
    return new GetAssignorQuery(assignorRepository, applicationService);
  },
  inject: [ASSIGNOR_REPOSITORY, APPLICATION_SERVICE],
};

export const GetAllAssignorsQueryProvider: Provider = {
  provide: GET_ALL_ASSIGNORS_QUERY,
  useFactory: (assignorRepository, applicationService) => {
    return new GetAllAssignorsQuery(assignorRepository, applicationService);
  },
  inject: [ASSIGNOR_REPOSITORY, APPLICATION_SERVICE],
};
