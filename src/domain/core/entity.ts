import { DateVO, ID } from '../value-objects';

const isEntity = (v: any): v is Entity<any> => {
  return v instanceof Entity;
};
export type UniqueEntityID = string;

export interface BaseEntityProps {
  id: ID;
  createdAt: DateVO;
  updatedAt: DateVO;
}
export interface CreateEntityProps<EntityProps> {
  props: EntityProps;
  id: ID;
  createdAt?: DateVO;
  updatedAt?: DateVO;
}

export abstract class Entity<EntityProps> {
  protected abstract _id: ID;
  protected readonly _createdAt: DateVO;
  protected readonly _updatedAt: DateVO;
  public readonly props: EntityProps;

  constructor({
    id,
    createdAt,
    updatedAt,
    props,
  }: CreateEntityProps<EntityProps>) {
    this.setId(id);
    this.props = props;
    this._createdAt = createdAt ?? DateVO.now();
    this._updatedAt = updatedAt ?? DateVO.now();
  }

  private setId(id: ID): void {
    this._id = id;
  }

  get createdAt(): DateVO {
    return this._createdAt;
  }

  get updatedAt(): DateVO {
    return this._updatedAt;
  }

  get id(): ID {
    return this._id;
  }

  public equals(object?: Entity<EntityProps>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this._id === object._id;
  }
}
