import { DomainEvent } from './domain-event';

export interface IEventEmitter {
  emitAsync(key: string, data: DomainEvent): Promise<any>;
  emit(key: string, data: DomainEvent): any;
}
