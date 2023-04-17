import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { ILogger } from '@domain/core';
import { IExternalLog, SendExternalLogsProps } from '@domain/core/external-log';

@Processor('elasticsearch')
export class ElasticSearchConsumer {
  constructor(
    private readonly elasticsearchService: IExternalLog,
    private readonly logger: ILogger,
  ) {}
  @Process()
  async process(job: Job<SendExternalLogsProps<any>>) {
    const { data } = job;
    await this.elasticsearchService.send<any>(data);
  }

  @OnQueueActive()
  onActive(job: Job<SendExternalLogsProps<any>>) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.queue.name}`,
      'ElasticSearchConsumer',
    );
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job<SendExternalLogsProps<any>>, err: Error) {
    this.logger.error(
      `job ${job.id} of type ${job.queue.name} with error ${JSON.stringify(
        err,
      )}...`,
      'ElasticSearchConsumer',
    );
    await job.remove();
  }
}
