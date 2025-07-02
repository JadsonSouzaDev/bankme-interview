import { ApplicationService } from './application-service.interface';

export class ApplicationServiceImpl implements ApplicationService {
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    try {
      // Aqui você pode adicionar lógica de transação se necessário
      // Por exemplo, usando um TransactionManager
      const result = await operation();

      // Aqui você pode adicionar lógica de commit da transação

      return result;
    } catch (error) {
      // Aqui você pode adicionar lógica de rollback da transação
      throw error;
    }
  }
} 