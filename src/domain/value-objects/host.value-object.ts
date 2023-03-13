import { DomainPrimitive, ValueObject } from '@domain/core';
import { ArgumentInvalidException } from '@domain/exceptions';

export class Host extends ValueObject<string> {
  public constructor(name: string) {
    super({ value: name });
  }

  get value(): string {
    return this.props.value;
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    try {
      const host = new URL(value).hostname;
      if (!host) throw new ArgumentInvalidException('invalid url');
    } catch (error) {
      throw new ArgumentInvalidException('invalid url', error);
    }
  }
}
