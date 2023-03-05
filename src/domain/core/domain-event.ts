import { ArgumentInvalidException } from '@domain/exceptions';
import { UUID } from '@domain/value-objects';

export type DomainEventProps<T> = Omit<
  T,
  'id' | 'correlationId' | 'dateOccurred'
> &
  Omit<DomainEvent, 'id' | 'correlationId' | 'dateOccurred'> & {
    correlationId?: string;
    dateOccurred?: number;
  };

export abstract class DomainEvent {
  public readonly id: string;

  /** Aggregate ID where domain event occurred */
  public readonly aggregateId: string;

  /** Date when this domain event occurred */
  public readonly dateOccurred: number;

  /** ID for correlation purposes (for UnitOfWork, Integration Events,logs correlation etc).
   * This ID is set automatically in a publisher.
   */
  public correlationId!: string;

  /**
   * Causation id to reconstruct execution ordering if needed
   */
  public causationId?: string;

  constructor(props: DomainEventProps<unknown>) {
    if (!props) {
      throw new ArgumentInvalidException(
        'DomainEvent props should not be empty',
      );
    }
    this.id = UUID.generate().value;
    this.aggregateId = props.aggregateId;
    this.dateOccurred = props.dateOccurred || Date.now();
    if (props.correlationId) this.correlationId = props.correlationId;
  }
}
