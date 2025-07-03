import { DomainEvent } from './domain-event';

export interface BaseRepository<T> {
  save(aggregate: T): Promise<T>;
  findById(id: string): Promise<T | null>;
  delete(id: string): Promise<void>;
}

export interface EventPublisher {
  publishAll(events: DomainEvent[]): Promise<void>;
}

export interface RepositoryWithEvents<T> extends BaseRepository<T> {
  setEventPublisher(publisher: EventPublisher): void;
}
