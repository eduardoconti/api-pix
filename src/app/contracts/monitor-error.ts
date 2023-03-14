export interface IMonitorError {
  capture: (exception: any, metadata?: any) => void;
}
