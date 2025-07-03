import { PayableDto } from '@bankme/shared';
import {
  BaseAggregate,
  BaseAggregateProps,
} from '../../common/domain/base-aggregate';
import { PayableCreatedEvent, PayableUpdatedEvent } from './events';

type PayableConstructor = {
  id: string;
  value: number;
  emissionDate: Date;
  assignorId: string;
  batchId?: string;
} & BaseAggregateProps;

export class Payable extends BaseAggregate<PayableDto> {
  public readonly id: string;
  public value: number;
  public emissionDate: Date;
  public assignorId: string;
  public batchId?: string;

  constructor(props: PayableConstructor) {
    super(props);
    this.id = props.id;
    this.value = props.value;
    this.emissionDate = props.emissionDate;
    this.assignorId = props.assignorId;
    this.batchId = props.batchId;
  }

  public static create(props: Omit<PayableConstructor, 'id'>): Payable {
    const payable = new Payable({
      ...props,
      id: crypto.randomUUID(),
    });

    payable.addDomainEvent(
      new PayableCreatedEvent({
        payableId: payable.id,
        value: payable.value,
        emissionDate: payable.emissionDate,
        assignorId: payable.assignorId,
        batchId: payable.batchId,
      }),
    );

    return payable;
  }

  public updateMultipleFields(updates: {
    value?: number;
    emissionDate?: Date;
    assignorId?: string;
  }): void {
    if (!this.isActive) {
      throw new Error('Não é possível atualizar um payable deletado');
    }

    const changes: Partial<PayableUpdatedEvent['payload']> = {
      payableId: this.id,
      updatedAt: new Date(),
    };

    // Validar e atualizar valor
    if (updates.value !== undefined) {
      if (updates.value <= 0) {
        throw new Error('Valor deve ser maior que zero');
      }
      this.value = updates.value;
      changes.value = this.value;
    }

    // Validar e atualizar data de emissão
    if (updates.emissionDate !== undefined) {
      if (!updates.emissionDate || !(updates.emissionDate instanceof Date)) {
        throw new Error('Data de emissão inválida');
      }
      this.emissionDate = updates.emissionDate;
      changes.emissionDate = this.emissionDate;
    }

    // Validar e atualizar assignor
    if (updates.assignorId !== undefined) {
      if (!updates.assignorId || updates.assignorId.trim().length === 0) {
        throw new Error('ID do assignor é obrigatório');
      }
      this.assignorId = updates.assignorId.trim();
      changes.assignorId = this.assignorId;
    }

    // Emitir apenas um evento com todas as mudanças
    if (Object.keys(changes).length > 2) {
      // Mais que payableId e updatedAt
      this.addDomainEvent(
        new PayableUpdatedEvent(changes as PayableUpdatedEvent['payload']),
      );
    }
  }

  public toDto(): PayableDto {
    return {
      id: this.id,
      assignorId: this.assignorId,
      value: this.value,
      emissionDate: this.emissionDate,
      batchId: this.batchId,
    } as PayableDto;
  }
}
