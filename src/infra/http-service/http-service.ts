import { HttpService as Axios } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

import { DateVO } from '@domain/value-objects';

type PostProps = {
  url: string;
  body?: any;
  headers?: any;
};
export interface IHttpService {
  post<Response>(props: PostProps): Promise<Response>;
}
@Injectable()
export class HttpService implements IHttpService {
  constructor(
    private readonly httpService: Axios,
    private readonly nestLogger: Logger,
  ) {}
  async post<Response>(props: PostProps) {
    this.nestLogger.log(JSON.stringify(props), 'EXTERNAL API REQUEST');
    const startedAt = DateVO.now().value.getTime();
    console.log(props);
    try {
      const { data } = await this.httpService.axiosRef.post<Response>(
        props.url,
        props.body,
        {
          headers: props.headers,
        },
      );

      this.nestLogger.log(JSON.stringify(data), 'EXTERNAL API RESPONSE');
      return data;
    } catch (error) {
      this.nestLogger.error(JSON.stringify(error), 'EXTERNAL API ERROR');
      throw error;
    } finally {
      const requestTime = DateVO.now().value.getTime() - startedAt;
      this.nestLogger.log(
        JSON.stringify({ url: props.url, requestTime }),
        'EXTERNAL API REQUEST',
      );
    }
  }
}
