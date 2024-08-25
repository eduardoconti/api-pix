import { Provider, Scope } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import {
  IEventEmitter,
  IUserRepository,
  IUserWebhookNotificationRepository,
} from '@domain/core';
import { IQueue } from '@domain/core/queue';
import { IChargeRepository, IWebhookRepository } from '@domain/core/repository';

import { CelcoinApi, ICelcoinApi } from '@infra/celcoin';
import {
  ChargeRepositoryMongo,
  UserRepositoryMongo,
  WebhookRepositoryMongo,
} from '@infra/database/mongo';
import { UserWebhookNotificationRepositoryMongo } from '@infra/database/mongo/user-webhook-notification.repository';

import { ChargeCreatedListener, ChargePayedListener } from './event-handler';
import { CelcoinService } from './services';
import {
  CelcoinImmediateChargeCreator,
  CreateImmediateCharge,
  ReceiveWebhook,
  RegisterUser,
  Authenticate,
} from './use-cases';

export const provideCreateImmediateChargeUseCase: Provider<CreateImmediateCharge> =
  {
    provide: CreateImmediateCharge,
    useFactory: (
      eventEmitter: IEventEmitter,
      ChargeRepositoryMongo: IChargeRepository,
    ) => {
      return new CreateImmediateCharge(eventEmitter, ChargeRepositoryMongo);
    },
    inject: [EventEmitter2, ChargeRepositoryMongo],
    scope: Scope.REQUEST,
  };

export const provideReceiveWebhookUseCase: Provider<ReceiveWebhook> = {
  provide: ReceiveWebhook,
  useFactory: (webhookRepository: IWebhookRepository) => {
    return new ReceiveWebhook(webhookRepository);
  },
  inject: [WebhookRepositoryMongo],
};

export const provideCelcoinService: Provider<CelcoinService> = {
  provide: CelcoinService,
  useFactory: (celcoinApi: ICelcoinApi) => {
    return new CelcoinService(celcoinApi);
  },
  inject: [CelcoinApi],
};

export const provideChargeCreatedListener: Provider<ChargeCreatedListener> = {
  provide: ChargeCreatedListener,
  useFactory: (queue: IQueue) => {
    return new ChargeCreatedListener(queue);
  },
  inject: ['BullQueue_elasticsearch'],
};

export const provideRegisterUserUseCase: Provider<RegisterUser> = {
  provide: RegisterUser,
  useFactory: (mongo: IUserRepository) => {
    return new RegisterUser(mongo);
  },
  inject: [UserRepositoryMongo],
};

export const provideUserAuthUseCase: Provider<Authenticate> = {
  provide: Authenticate,
  useFactory: (userRepository: IUserRepository) => {
    return new Authenticate(userRepository);
  },
  inject: [UserRepositoryMongo],
};

export const provideChargePayedListener: Provider<ChargePayedListener> = {
  provide: ChargePayedListener,
  useFactory: (
    userWebhookNotificationRepository: IUserWebhookNotificationRepository,
    userRepository: IUserRepository,
  ) => {
    return new ChargePayedListener(
      userWebhookNotificationRepository,
      userRepository,
    );
  },
  inject: [UserWebhookNotificationRepositoryMongo, UserRepositoryMongo],
};

export const provideCelcoinImmediateChargeCreator: Provider<CelcoinImmediateChargeCreator> =
  {
    provide: CelcoinImmediateChargeCreator,
    useFactory: (celcoinService: CelcoinService) => {
      return new CelcoinImmediateChargeCreator(celcoinService);
    },
    inject: [CelcoinService],
  };
