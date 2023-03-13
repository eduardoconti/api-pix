import { DomainPrimitive, ValueObject } from '@domain/core';
import { ArgumentInvalidException } from '@domain/exceptions';

export class Name extends ValueObject<string> {
  public constructor(name: string) {
    super({ value: name });
  }

  get value(): string {
    return this.props.value;
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    if (value.length <= 2 || value.length > 100) {
      throw new ArgumentInvalidException(
        'Name must be greater than 2 and less than 100 characters.',
      );
    }
  }
}
