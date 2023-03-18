import { ChargeProvider, WebhookTypes } from '@domain/entities';

export type WebhookNotificationPayload = {
  notification_id: string;
  url: string;
  charge_id: string;
  e2e_id: string;
  provider: ChargeProvider;
  provider_id: string;
  type: WebhookTypes;
  amount: number;
};
