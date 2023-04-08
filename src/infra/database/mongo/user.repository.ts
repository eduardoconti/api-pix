import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IUserRepository, QueryParams } from '@domain/core';
import { UserEntity, UserPrimitivesProps, UserProps } from '@domain/entities';
import { Email } from '@domain/value-objects';

import { UserModel } from '@infra/database/models';
import { UserNotFoundException } from '@infra/exceptions';

@Injectable()
export class UserRepositoryMongo implements IUserRepository {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>,
  ) {}

  async save(entity: UserEntity): Promise<UserEntity> {
    const createdCat = new this.userModel(UserModel.fromEntity(entity));
    const saved = await createdCat.save();
    return UserModel.toEntity(saved);
  }

  async exists(email: Email): Promise<boolean> {
    const user = await this.userModel.findOne({ email: email.value });

    if (!user) {
      return false;
    }
    return true;
  }

  async findOne(params: QueryParams<UserProps>): Promise<UserEntity> {
    const query: Partial<UserPrimitivesProps> = {};
    if (params.id) {
      query.id = params.id.value;
    }
    if (params.email) {
      query.email = params.email.value;
    }
    const user = await this.userModel.findOne(query);

    if (!user) {
      throw new UserNotFoundException('user not found');
    }
    return UserModel.toEntity(user);
  }

  async findMany(params: QueryParams<UserProps>): Promise<UserEntity[] | []> {
    const users = await this.userModel.find({ status: params.status });
    return users.map((e) => {
      return UserModel.toEntity(e);
    });
  }

  async update(entity: UserEntity): Promise<UserEntity> {
    await this.userModel.updateOne(
      { id: entity.id.value },
      { $set: UserModel.fromEntity(entity) },
    );

    return entity;
  }
}
