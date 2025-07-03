import { BatchCompletedEvent } from '../../../payables/domain/events/batch-completed.event';
import { PayableErrorEvent } from '../../../payables/domain/events/payable-error.event';
import { DomainEvent } from '../../domain/domain-event';
import { EventBus } from './event-bus.interface';
import { Logger } from '@nestjs/common';

export class EventBusImpl implements EventBus {
  private readonly logger = new Logger(EventBusImpl.name);
  async publish(event: DomainEvent): Promise<void> {
    this.logger.verbose(event.type);

    //TODO: Move to a consumer
    if (event.type === 'BatchCompleted') {
      await this.sendEmailBatchCompleted(event as BatchCompletedEvent);
    }

    //TODO: Move to a consumer
    if (event.type === 'PayableError') {
      await this.sendEmailPayableFailed(event as PayableErrorEvent);
    }
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  private async sendEmailBatchCompleted(
    event: BatchCompletedEvent,
  ): Promise<void> {
    await new Promise((resolve) =>
      setTimeout(() => {
        this.logger.verbose(
          `Sending email batch completed: BatchId: ${event.payload.batchId} SuccessCount: ${event.payload.successCount} FailedCount: ${event.payload.failedCount}`,
        );
        resolve(true);
      }, 100),
    );
  }

  private async sendEmailPayableFailed(
    event: PayableErrorEvent,
  ): Promise<void> {
    await new Promise((resolve) =>
      setTimeout(() => {
        this.logger.verbose(
          `Sending email payable failed: ${JSON.stringify(event.payload)}`,
        );
        resolve(true);
      }, 100),
    );
  }
}
