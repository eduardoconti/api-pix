import * as APM from 'elastic-apm-node';
import apm from 'elastic-apm-node';

let instance: APM.Agent | undefined;

export const initializeAPMAgent = (config?: APM.AgentConfigOptions): void => {
  instance = config ? apm.start(config) : apm.start();
};

export const getInstance = (): APM.Agent => {
  if (!instance) {
    throw new Error('APM Agent is not initialized (run initializeAPMAgent) ');
  }

  return instance;
};
