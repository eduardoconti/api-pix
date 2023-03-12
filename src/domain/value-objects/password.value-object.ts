import { DomainPrimitive, ValueObject } from '@domain/core';
import { ArgumentInvalidException } from '@domain/exceptions';

export class Password extends ValueObject<string> {
  public constructor(value: string) {
    super({ value });
  }

  get value(): string {
    return this.props.value;
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    if (!value) {
      throw new ArgumentInvalidException('password must be not empty');
    }
  }
}
