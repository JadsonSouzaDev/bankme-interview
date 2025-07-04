import { ApplicationService } from './application-service.interface';

export class ApplicationServiceImpl implements ApplicationService {
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    try {
      const result = await operation();

      return result;
    } catch (error) {
      throw error;
    }
  }
}
