import { ILogger, IOutboxRepository, IQueue } from '@domain/core';
import { AggregateTypeEnum } from '@domain/entities';

export abstract class OutboxService {
  protected abstract aggregateType: AggregateTypeEnum;

  constructor(
    protected readonly logger: ILogger,
    private readonly outboxRepository: IOutboxRepository,
    private readonly queue: IQueue,
  ) {}

  async execute(): Promise<void> {
    const data = await this.outboxRepository.findMany({
      published: false,
      aggregateType: this.aggregateType,
    });
    if (!data.length) return;

    data.forEach(async (outbox) => {
      try {
        const payload = JSON.parse(outbox.props.payload);
        await this.queue.add(payload);
        outbox.markAsPublished();
        await this.outboxRepository.update(outbox);
      } catch (error) {
        this.logger.error(
          `failed to execute ${this.aggregateType} for Outbox ${outbox.id.value}`,
          error,
        );
      }
    });
  }
}
