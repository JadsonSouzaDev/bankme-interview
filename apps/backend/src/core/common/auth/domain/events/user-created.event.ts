import { DomainEvent } from '../../../../common/domain/domain-event';

export class UserCreatedEvent implements DomainEvent {
  public readonly type = 'UserCreated';
  public readonly occurredOn: Date;
  public readonly payload: {
    userId: string;
    login: string;
  };

  constructor(payload: { userId: string; login: string }) {
    this.occurredOn = new Date();
    this.payload = payload;
  }
}
