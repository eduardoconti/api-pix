import { Inject, UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { TokenPayload } from '@app/contracts';

import { IUserWebhookNotificationRepository } from '@domain/core';
import { UUID } from '@domain/value-objects';

import { UserWebhookNotificationModel } from '@infra/database/models';
import { UserWebhookNotificationRepositoryMongo } from '@infra/database/mongo';
import { User } from '@infra/decorators';
import { GqlAuthGuard } from '@infra/guard';

@Resolver(() => UserWebhookNotificationModel)
export class UserWebhookNotificationResolver {
  constructor(
    @Inject(UserWebhookNotificationRepositoryMongo)
    private readonly userWebhookNotificationRepository: IUserWebhookNotificationRepository,
  ) {}
  @Query(() => [UserWebhookNotificationModel])
  @UseGuards(GqlAuthGuard)
  async findAllUserWeboohok(
    @User() user: TokenPayload,
  ): Promise<UserWebhookNotificationModel[]> {
    const result = await this.userWebhookNotificationRepository.findMany({
      userId: new UUID(user.userId),
    });
    return result.map((e) => {
      const model = UserWebhookNotificationModel.fromEntity(e);
      return { ...model, payload: JSON.parse(model.payload) };
    });
  }
}
