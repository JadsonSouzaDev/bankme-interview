import { AssignorDto } from '@bankme/shared';
import {
  BaseAggregate,
  BaseAggregateProps,
} from '../../common/domain/base-aggregate';
import { AssignorCreatedEvent, AssignorUpdatedEvent } from './events';

type AssignorConstructor = {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
} & BaseAggregateProps;

export class Assignor extends BaseAggregate<AssignorDto> {
  public readonly id: string;
  public name: string;
  public email: string;
  public document: string;
  public phone: string;

  constructor(props: AssignorConstructor) {
    super(props);
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.document = props.document;
    this.phone = props.phone;
  }

  public static create(props: Omit<AssignorConstructor, 'id'>): Assignor {
    const assignor = new Assignor({
      ...props,
      id: crypto.randomUUID(),
    });

    assignor.addDomainEvent(
      new AssignorCreatedEvent({
        assignorId: assignor.id,
        name: assignor.name,
        email: assignor.email,
        document: assignor.document,
        phone: assignor.phone,
      }),
    );

    return assignor;
  }

  public updateMultipleFields(updates: {
    name?: string;
    email?: string;
    document?: string;
    phone?: string;
  }): void {
    if (!this.isActive) {
      throw new Error('Não é possível atualizar um assignor deletado');
    }

    const changes: Partial<AssignorUpdatedEvent['payload']> = {
      assignorId: this.id,
      updatedAt: new Date(),
    };

    if (updates.name !== undefined) {
      if (!updates.name || updates.name.trim().length < 2) {
        throw new Error('Nome deve ter pelo menos 2 caracteres');
      }
      this.name = updates.name.trim();
      changes.name = this.name;
    }

    if (updates.email !== undefined) {
      if (!updates.email) {
        throw new Error('Email inválido');
      }
      this.email = updates.email.toLowerCase().trim();
      changes.email = this.email;
    }

    if (updates.document !== undefined) {
      if (!updates.document || updates.document.trim().length < 7) {
        throw new Error('Documento deve ter pelo menos 7 caracteres');
      }
      this.document = updates.document.trim();
      changes.document = this.document;
    }

    if (updates.phone !== undefined) {
      if (!updates.phone || updates.phone.trim().length < 10) {
        throw new Error('Telefone deve ter pelo menos 10 caracteres');
      }
      this.phone = updates.phone.trim();
      changes.phone = this.phone;
    }

    if (Object.keys(changes).length > 2) {
      this.addDomainEvent(
        new AssignorUpdatedEvent(changes as AssignorUpdatedEvent['payload']),
      );
    }
  }

  public toDto(): AssignorDto {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      document: this.document,
      phone: this.phone,
    } as AssignorDto;
  }
}
