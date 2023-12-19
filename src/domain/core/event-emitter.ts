export interface IEventEmitter {
  emitAsync<T>(key: string, data: T): Promise<any>;
  emit<T>(key: string, data: T): any;
}
