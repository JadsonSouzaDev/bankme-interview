import { Provider } from '@nestjs/common';
import { PrismaAssignorRepository } from '../../../core/assignors/infra/database/prisma-assignor.repository';
import { EventBusImpl } from 'src/core/common/application/events/event-bus.impl';

export const ASSIGNOR_REPOSITORY = 'ASSIGNOR_REPOSITORY';

export const AssignorRepositoryProvider: Provider = {
  provide: ASSIGNOR_REPOSITORY,
  useFactory: () => {
    const repository = new PrismaAssignorRepository();
    const eventBus = new EventBusImpl();
    repository.setEventPublisher(eventBus);
    return repository;
  },
};
