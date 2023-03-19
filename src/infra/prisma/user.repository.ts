import { Injectable } from '@nestjs/common';

import { IUserRepository, QueryParams } from '@domain/core/repository';
import { UserEntity, UserProps } from '@domain/entities';
import { DateVO, Email } from '@domain/value-objects';

import {
  UserNotFoundException,
  UserRepositoryException,
} from '@infra/exceptions';

import { UserModel } from './models';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async save(entity: UserEntity): Promise<UserEntity> {
    try {
      const { userWebhookHost, ...rest } = UserModel.fromEntity(entity);
      const prismaModel = {
        ...rest,

        userWebhookHost: userWebhookHost
          ? {
              create: [
                ...userWebhookHost.map(
                  ({ created_at, id, type, updated_at, webhook_host }) => {
                    return { created_at, id, type, updated_at, webhook_host };
                  },
                ),
              ],
            }
          : undefined,
      };
      const saved = await this.prismaService.user.create({
        data: prismaModel,
      });
      return UserModel.toEntity({ ...saved, userWebhookHost });
    } catch (e) {
      throw new UserRepositoryException('failed to create user on database', e);
    }
  }

  async findOne(params: QueryParams<UserProps>) {
    const model = await this.prismaService.user
      .findFirst({
        where: {
          id: params.id?.value,
          email: params.email?.value,
        },
        include: {
          userWebhookHost: true,
        },
      })
      .catch((e) => {
        throw new UserRepositoryException('failed to find user on database', e);
      });

    if (!model) {
      throw new UserNotFoundException('user not found');
    }
    return UserModel.toEntity(model);
  }

  async findMany(params: QueryParams<UserProps>): Promise<UserEntity[] | []> {
    const models = await this.prismaService.user
      .findMany({
        where: {
          status: params?.status,
        },
        include: {
          userWebhookHost: true,
        },
      })
      .catch((e) => {
        throw new UserRepositoryException(
          'failed to findMany user on database',
          e,
        );
      });
    return models.map((e) => UserModel.toEntity(e));
  }

  async update(entity: UserEntity): Promise<UserEntity> {
    const { id, email, name, password, status } = UserModel.fromEntity(entity);
    try {
      const saved = await this.prismaService.user.update({
        data: {
          email,
          name,
          password,
          status,
          updated_at: DateVO.now().value,
        },
        where: { id },
      });
      return UserModel.toEntity(saved as UserModel);
    } catch (e) {
      throw new UserRepositoryException('failed to update user on database', e);
    }
  }

  async exists(email: Email): Promise<boolean> {
    const model = await this.prismaService.user
      .findUnique({
        where: {
          email: email.value,
        },
        include: {
          userWebhookHost: true,
        },
      })
      .catch((e) => {
        throw new UserRepositoryException('failed to find user on database', e);
      });

    if (!model) {
      return false;
    }
    return true;
  }
}
