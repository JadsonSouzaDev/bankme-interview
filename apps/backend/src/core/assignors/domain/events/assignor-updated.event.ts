import { DomainEvent } from '../../../common/domain/domain-event';

export class AssignorUpdatedEvent implements DomainEvent {
  public readonly type = 'AssignorUpdated';
  public readonly occurredOn: Date;
  public readonly payload: {
    assignorId: string;
    name?: string;
    email?: string;
    document?: string;
    phone?: string;
    updatedAt: Date;
  };

  constructor(payload: {
    assignorId: string;
    name?: string;
    email?: string;
    document?: string;
    phone?: string;
    updatedAt: Date;
  }) {
    this.occurredOn = new Date();
    this.payload = payload;
  }
} 