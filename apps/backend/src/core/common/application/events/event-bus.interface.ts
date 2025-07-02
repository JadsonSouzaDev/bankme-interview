import { DomainEvent } from '../../domain/domain-event';

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
} 