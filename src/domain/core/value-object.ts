export type Primitives = string | number | boolean | Date;

export interface DomainPrimitive<T extends Primitives> {
  value: T;
}
type ValueObjectProps<T> = T extends Primitives ? DomainPrimitive<T> : T;
export abstract class ValueObject<T> {
  protected readonly props: ValueObjectProps<T>;

  constructor(props: ValueObjectProps<T>) {
    this.checkIfEmpty(props);
    this.validate(props);
    this.props = props;
  }

  protected abstract validate(props: ValueObjectProps<T>): void;

  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this) === JSON.stringify(vo);
  }

  private checkIfEmpty(props: ValueObjectProps<T>): void {
    if (
      props === null ||
      props === undefined ||
      (typeof props === 'string' && props.trim().length === 0) ||
      (props instanceof Date && isNaN(props.getTime()))
    ) {
      throw new Error('Property cannot be empty');
    }
  }
}
