export interface IQueue<T = any> {
  /**
   * The name of the queue
   */
  name: string;

  add(data: T): Promise<void>;
}
