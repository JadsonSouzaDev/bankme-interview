import { DomainEvent } from '../../domain/domain-event';
import { EventBus } from './event-bus.interface';
import { Logger } from '@nestjs/common';

export class EventBusImpl implements EventBus {
  private readonly logger = new Logger(EventBusImpl.name);
  async publish(event: DomainEvent): Promise<void> {
    this.logger.verbose(event.type);

    // Aqui você pode implementar a lógica real de publicação
    // Por exemplo, enviar para um message broker como RabbitMQ, Kafka, etc.
    // Ou salvar em uma tabela de eventos para processamento posterior

    // Simulação de processamento assíncrono
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  async publishAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
