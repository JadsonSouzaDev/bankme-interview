// Interface base para todos os comandos
export interface BaseCommand<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}
