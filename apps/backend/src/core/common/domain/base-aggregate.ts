import { DomainEvent } from './domain-event';

export interface BaseAggregateProps {
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class BaseAggregate<T> {
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _isActive: boolean;

  constructor(props: BaseAggregateProps) {
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
    this._isActive = props.isActive || true;
  }
  private _domainEvents: DomainEvent[] = [];
  
  public get isActive(): boolean {
    return this._isActive;
  }

  public deactivate(): void {
    this._isActive = false;
  }

  public activate(): void {
    this._isActive = true;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public getDomainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }

  public markAsPersisted(): void {
    // Here you can add additional logic if needed
    // For example, mark that the aggregate was saved to the database
  }

  public abstract toDto(): T;
}
