// Base interface for all commands
export interface BaseCommand<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}
