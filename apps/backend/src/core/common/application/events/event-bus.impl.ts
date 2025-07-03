import { DomainEvent } from '../../domain/domain-event';
import { EventBus } from './event-bus.interface';

export class EventBusImpl implements EventBus {
  async publish(event: DomainEvent): Promise<void> {
    console.log(`Publicando evento: ${event.type}`, event);

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
