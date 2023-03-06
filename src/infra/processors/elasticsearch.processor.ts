import { OnQueueActive, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bull';

import { IExternalLog, SendExternalLogsProps } from '@domain/core/external-log';

import { ElasticSearch } from '@infra/elastic';

@Processor('elasticsearch')
export class ElasticSearchConsumer {
  constructor(
    @Inject(ElasticSearch)
    private readonly elasticsearchService: IExternalLog,
    private readonly logger: Logger,
  ) {}
  @Process()
  async sendLog(job: Job<SendExternalLogsProps<any>>) {
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
  onQueueFailed(job: Job<SendExternalLogsProps<any>>, err: Error) {
    this.logger.error(
      `job ${job.id} of type ${job.queue.name} with error ${JSON.stringify(
        err,
      )}...`,
      'ElasticSearchConsumer',
    );
  }
}
