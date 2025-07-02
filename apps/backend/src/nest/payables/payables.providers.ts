import { Provider } from '@nestjs/common';
import { CreatePayableCommand } from '../../core/payables/application/commands/create-payable/create-payable.command';
import { UpdatePayableCommand } from '../../core/payables/application/commands/update-payable/update-payable.command';
import { DeletePayableCommand } from '../../core/payables/application/commands/delete-payable/delete-payable.command';
import { GetPayableQuery } from '../../core/payables/application/queries/get-payable/get-payable.query';
import { GetAllPayablesQuery } from '../../core/payables/application/queries/get-all-payables/get-all-payables.query';
import { ApplicationServiceImpl } from '../../core/common/application/application-service.impl';
import { PrismaPayableRepository } from '../../core/payables/infra/database/prisma-payable.repository';
import { PrismaAssignorRepository } from '../../core/assignors/infra/database/prisma-assignor.repository';
import { EventBusImpl } from '../../core/common/application/events/event-bus.impl';
import { PayableRepository } from '../../core/payables/domain/payable.repository';
import { AssignorRepository } from '../../core/assignors/domain/assignor.repository';
import { ApplicationService } from '../../core/common/application/application-service.interface';

// Tokens
export const APPLICATION_SERVICE = 'APPLICATION_SERVICE';
export const PAYABLE_REPOSITORY = 'PAYABLE_REPOSITORY';
export const ASSIGNOR_REPOSITORY = 'ASSIGNOR_REPOSITORY';
export const CREATE_PAYABLE_COMMAND = 'CREATE_PAYABLE_COMMAND';
export const UPDATE_PAYABLE_COMMAND = 'UPDATE_PAYABLE_COMMAND';
export const DELETE_PAYABLE_COMMAND = 'DELETE_PAYABLE_COMMAND';
export const GET_PAYABLE_QUERY = 'GET_PAYABLE_QUERY';
export const GET_ALL_PAYABLES_QUERY = 'GET_ALL_PAYABLES_QUERY';

// Application Service Provider
export const ApplicationServiceProvider: Provider = {
  provide: APPLICATION_SERVICE,
  useClass: ApplicationServiceImpl,
};

// Repository Providers
export const PayableRepositoryProvider: Provider = {
  provide: PAYABLE_REPOSITORY,
  useFactory: () => {
    const repository = new PrismaPayableRepository();
    const eventBus = new EventBusImpl();
    repository.setEventPublisher(eventBus);
    return repository;
  },
};

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
export const CreatePayableCommandProvider: Provider = {
  provide: CREATE_PAYABLE_COMMAND,
  inject: [PAYABLE_REPOSITORY, ASSIGNOR_REPOSITORY, APPLICATION_SERVICE],
  useFactory: (
    repository: PayableRepository,
    assignorRepository: AssignorRepository,
    applicationService: ApplicationService,
  ) => {
    return new CreatePayableCommand(
      repository,
      assignorRepository,
      applicationService,
    );
  },
};

export const UpdatePayableCommandProvider: Provider = {
  provide: UPDATE_PAYABLE_COMMAND,
  useFactory: (payableRepository, assignorRepository, applicationService) => {
    return new UpdatePayableCommand(
      payableRepository,
      assignorRepository,
      applicationService,
    );
  },
  inject: [PAYABLE_REPOSITORY, ASSIGNOR_REPOSITORY, APPLICATION_SERVICE],
};

export const DeletePayableCommandProvider: Provider = {
  provide: DELETE_PAYABLE_COMMAND,
  useFactory: (payableRepository, applicationService) => {
    return new DeletePayableCommand(payableRepository, applicationService);
  },
  inject: [PAYABLE_REPOSITORY, APPLICATION_SERVICE],
};

// Query Providers
export const GetPayableQueryProvider: Provider = {
  provide: GET_PAYABLE_QUERY,
  useFactory: (payableRepository, applicationService) => {
    return new GetPayableQuery(payableRepository, applicationService);
  },
  inject: [PAYABLE_REPOSITORY, APPLICATION_SERVICE],
};

export const GetAllPayablesQueryProvider: Provider = {
  provide: GET_ALL_PAYABLES_QUERY,
  useFactory: (payableRepository, applicationService) => {
    return new GetAllPayablesQuery(payableRepository, applicationService);
  },
  inject: [PAYABLE_REPOSITORY, APPLICATION_SERVICE],
};
