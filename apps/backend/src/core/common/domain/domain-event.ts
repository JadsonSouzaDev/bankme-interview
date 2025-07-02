export interface DomainEvent {
  type: string;
  occurredOn: Date;
  payload: Record<string, any>;
} 