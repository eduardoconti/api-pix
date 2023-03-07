import { ArgumentInvalidException } from '@domain/exceptions';

import { DomainPrimitive, ValueObject } from '../core';

export class Amount extends ValueObject<number> {
  public constructor(value: number) {
    super({ value });
  }

  public get value(): number {
    return this.props.value;
  }

  toBrlString(): string {
    return (this.props.value / 100).toFixed(2);
  }

  static fromBrlString(value: string): number {
    const newValue = parseFloat(value) * 100;
    return new Amount(
      Number.isInteger(newValue) ? newValue : Math.round(newValue),
    ).value;
  }

  protected validate({ value }: DomainPrimitive<number>): void {
    const regexExp = /^\d+$/gi;
    if (!regexExp.test(value.toString())) {
      throw new ArgumentInvalidException('Incorrect amount format');
    }
  }
}
