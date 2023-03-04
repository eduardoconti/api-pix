export interface IQrCodeService {
  payload: (props: QrCodeProps) => string;
  base64: (props: QrCodeProps) => Promise<string>;
}

export type QrCodeProps = {
  key: string; //or any PIX key
  name: string;
  city: string;
  value: number;
  transactionId?: string; //max 25 characters
  message?: string;
  cep?: string;
};
