import { DomainEvent } from '../../../common/domain/domain-event';

export class PayableCreatedEvent implements DomainEvent {
  public readonly type = 'PayableCreated';
  public readonly occurredOn: Date;
  public readonly payload: {
    payableId: string;
    value: number;
    emissionDate: Date;
    assignorId: string;
  };

  constructor(payload: {
    payableId: string;
    value: number;
    emissionDate: Date;
    assignorId: string;
  }) {
    this.occurredOn = new Date();
    this.payload = payload;
  }
}
