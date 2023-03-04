import * as QRCode from 'qrcode';

import { ArgumentInvalidException } from '@domain/exceptions';

import { DomainPrimitive, ValueObject } from '../core';

export class QrCode64 extends ValueObject<string> {
  public constructor(value: string) {
    super({ value });
  }
  static async base64(emv: string): Promise<QrCode64> {
    const qr = await QRCode.toDataURL(emv);
    return new QrCode64(qr);
  }

  public get value(): string {
    return this.props.value;
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    const regexExp = /^data:image\/png;base64,[\w+/=-]+$/gi;
    if (!regexExp.test(value)) {
      throw new ArgumentInvalidException('Incorrect base64 image format');
    }
  }
}
