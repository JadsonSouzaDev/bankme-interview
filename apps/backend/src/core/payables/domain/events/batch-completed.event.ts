import { DomainEvent } from '../../../common/domain/domain-event';

export class BatchCompletedEvent implements DomainEvent {
  public readonly type = 'BatchCompleted';
  public readonly occurredOn: Date;
  public readonly payload: {
    batchId: string;
    successCount: number;
    failedCount: number;
  };

  constructor(payload: {
    batchId: string;
    successCount: number;
    failedCount: number;
  }) {
    this.occurredOn = new Date();
    this.payload = payload;
  }
}
