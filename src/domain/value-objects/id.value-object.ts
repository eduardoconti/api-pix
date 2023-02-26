import { DomainPrimitive, ValueObject } from '../core';

export abstract class ID extends ValueObject<string> {
  constructor(value: string) {
    super({ value });
  }

  public get value(): string {
    return this.props.value;
  }

  protected abstract override validate({
    value,
  }: DomainPrimitive<string>): void;
}
