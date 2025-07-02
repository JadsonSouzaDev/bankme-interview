import { DomainEvent } from '../../../common/domain/domain-event';

export class PayableUpdatedEvent implements DomainEvent {
  public readonly type = 'PayableUpdated';
  public readonly occurredOn: Date;
  public readonly payload: {
    payableId: string;
    value?: number;
    emissionDate?: Date;
    assignorId?: string;
    updatedAt: Date;
  };

  constructor(payload: {
    payableId: string;
    value?: number;
    emissionDate?: Date;
    assignorId?: string;
    updatedAt: Date;
  }) {
    this.occurredOn = new Date();
    this.payload = payload;
  }
}
