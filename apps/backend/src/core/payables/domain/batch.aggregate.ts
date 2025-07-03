import {
  BaseAggregate,
  BaseAggregateProps,
} from '../../common/domain/base-aggregate';
import { BatchDto } from '@bankme/shared';
import { BatchCompletedEvent } from './events/batch-completed.event';
import { PayableErrorEvent } from './events/payable-error.event';

export type BatchStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED';

type PayableError = {
  value: number;
  emissionDate: Date;
  assignorId: string;
  errorMessage: string;
};

type BatchConstructor = {
  id: string;
  name?: string;
  description?: string;
  status: BatchStatus;
  totalItems: number;
  successCount: number;
  failedCount: number;
} & BaseAggregateProps;

export class Batch extends BaseAggregate<BatchDto> {
  public readonly id: string;
  public status: BatchStatus;
  public totalItems: number;
  public successCount: number;
  public failedCount: number;

  constructor(props: BatchConstructor) {
    super(props);
    this.id = props.id;
    this.status = props.status;
    this.totalItems = props.totalItems;
    this.successCount = props.successCount;
    this.failedCount = props.failedCount;
  }

  public static create(props: {
    name?: string;
    description?: string;
    totalItems: number;
  }): Batch {
    const batch = new Batch({
      ...props,
      id: crypto.randomUUID(),
      status: 'PENDING',
      successCount: 0,
      failedCount: 0,
    });

    return batch;
  }

  public startProcessing(): void {
    if (!this.isActive) {
      throw new Error('Not possible to process a deleted batch');
    }

    if (this.status !== 'PENDING') {
      throw new Error('Batch was already processed or is in processing');
    }

    this.status = 'PROCESSING';
  }

  public markAsCompleted(): void {
    if (!this.isActive) {
      throw new Error('Not possible to mark a deleted batch as completed');
    }

    if (this.status !== 'PROCESSING') {
      throw new Error('Batch must be in processing to be marked as completed');
    }

    this.status = 'COMPLETED';
  }

  public incrementSuccess(): void {
    if (!this.isActive) {
      throw new Error('Not possible to increment successes in a deleted batch');
    }

    this.successCount++;
  }

  public incrementFailed(payableError: PayableError): void {
    if (!this.isActive) {
      throw new Error('Not possible to increment failed in a deleted batch');
    }

    this.addDomainEvent(
      new PayableErrorEvent({
        batchId: this.id,
        value: payableError.value,
        emissionDate: payableError.emissionDate,
        assignorId: payableError.assignorId,
        errorMessage: payableError.errorMessage,
      }),
    );

    this.failedCount++;
  }

  public updateProgress(successCount: number, failedCount: number): void {
    if (!this.isActive) {
      throw new Error('Not possible to update progress of a deleted batch');
    }

    if (successCount < 0 || failedCount < 0) {
      throw new Error('Counters cannot be negative');
    }

    if (successCount + failedCount > this.totalItems) {
      throw new Error(
        'Total of processed items cannot exceed the total of the batch',
      );
    }

    this.successCount = successCount;
    this.failedCount = failedCount;

    if (successCount + failedCount === this.totalItems) {
      this.markAsCompleted();
      this.addDomainEvent(
        new BatchCompletedEvent({
          batchId: this.id,
          successCount: this.successCount,
          failedCount: this.failedCount,
        }),
      );
    }
  }

  public toDto(): BatchDto {
    return {
      id: this.id,
      status: this.status,
      totalItems: this.totalItems,
      successCount: this.successCount,
      failedCount: this.failedCount,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
