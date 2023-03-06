import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { IExternalLog, SendExternalLogsProps } from '@domain/core/external-log';

@Injectable()
export class ElasticSearch implements IExternalLog {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly logger: Logger,
  ) {}

  async send<T>(props: SendExternalLogsProps<T>): Promise<void> {
    const { index, body } = props;
    try {
      await this.elasticsearchService.index({
        index,
        body,
      });
    } catch (error) {
      this.logger.error(JSON.stringify(error), 'ELASTIC SEARCH');
    }
  }
}
