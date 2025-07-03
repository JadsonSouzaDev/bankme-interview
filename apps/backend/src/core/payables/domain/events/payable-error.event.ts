import { DomainEvent } from '../../../common/domain/domain-event';

export class PayableErrorEvent implements DomainEvent {
  public readonly type = 'PayableError';
  public readonly occurredOn: Date;
  public readonly payload: {
    value: number;
    emissionDate: Date;
    assignorId: string;
    batchId: string;
    errorMessage: string;
  };

  constructor(payload: {
    value: number;
    emissionDate: Date;
    assignorId: string;
    batchId: string;
    errorMessage: string;
  }) {
    this.occurredOn = new Date();
    this.payload = payload;
  }
}
