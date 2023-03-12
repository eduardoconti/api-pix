import { DomainPrimitive, ValueObject } from '@domain/core';
import { ArgumentInvalidException } from '@domain/exceptions';

export class Email extends ValueObject<string> {
  public constructor(name: string) {
    super({ value: name });
  }

  get value(): string {
    return this.props.value;
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    const string = String(value)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );

    if (!string) {
      throw new ArgumentInvalidException('invalid email');
    }
  }
}
