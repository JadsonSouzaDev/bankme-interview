import { DomainEvent } from '../../domain/domain-event';
import {
  RepositoryWithEvents,
  EventPublisher,
} from '../../domain/base-repository.interface';

export abstract class BaseRepositoryImpl<T> implements RepositoryWithEvents<T> {
  protected eventPublisher?: EventPublisher;

  setEventPublisher(publisher: EventPublisher): void {
    this.eventPublisher = publisher;
  }

  async save(aggregate: T): Promise<T> {
    const savedAggregate = await this.saveToDatabase(aggregate);

    await this.publishDomainEvents(aggregate);

    return savedAggregate;
  }

  protected abstract saveToDatabase(aggregate: T): Promise<T>;
  protected abstract findByIdFromDatabase(id: string): Promise<T | null>;
  protected abstract deleteFromDatabase(id: string): Promise<void>;
  protected abstract getDomainEvents(aggregate: T): DomainEvent[];
  protected abstract clearDomainEvents(aggregate: T): void;

  async findById(id: string): Promise<T | null> {
    return this.findByIdFromDatabase(id);
  }

  async delete(id: string): Promise<void> {
    await this.deleteFromDatabase(id);
  }

  private async publishDomainEvents(aggregate: T): Promise<void> {
    if (!this.eventPublisher) {
      console.warn(
        'EventPublisher not configured. Events will not be published.',
      );
      return;
    }

    const events = this.getDomainEvents(aggregate);
    if (events.length > 0) {
      await this.eventPublisher.publishAll(events);
      this.clearDomainEvents(aggregate);
    }
  }
}
