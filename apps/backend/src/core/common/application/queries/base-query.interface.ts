export interface BaseQuery<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}
