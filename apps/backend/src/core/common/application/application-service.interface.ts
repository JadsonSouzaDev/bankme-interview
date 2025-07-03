export interface ApplicationService {
  execute<T>(operation: () => Promise<T>): Promise<T>;
}
