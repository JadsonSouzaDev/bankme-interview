import { DomainEvent } from '../../../common/domain/domain-event';

export class AssignorCreatedEvent implements DomainEvent {
  public readonly type = 'AssignorCreated';
  public readonly occurredOn: Date;
  public readonly payload: {
    assignorId: string;
    name: string;
    email: string;
    document: string;
    phone: string;
  };

  constructor(payload: {
    assignorId: string;
    name: string;
    email: string;
    document: string;
    phone: string;
  }) {
    this.occurredOn = new Date();
    this.payload = payload;
  }
}
