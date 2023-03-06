type Index = 'charge';
export type ExternalLogs<T> = {
  createdAt: Date;
  service: string;
  event: T;
};

export type SendExternalLogsProps<T> = {
  index: Index;
  body: ExternalLogs<T>;
};
export interface IExternalLog {
  send<T>(props: SendExternalLogsProps<T>): Promise<void>;
}
