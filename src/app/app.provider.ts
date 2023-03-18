import { Provider } from '@nestjs/common';
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
  ChargeRepository,
  UserWebhookNotificationRepository,
  WebhookRepository,
} from '@infra/prisma';
import { UserRepository } from '@infra/prisma/user.repository';

import { IPspService } from './contracts';
import { ChargeCreatedListener, ChargePayedListener } from './event-handler';
import { PspService } from './services';
import {
  CreateImmediateChargeUseCase,
  ReceiveWebhookUseCase,
  RegisterUserUseCase,
  UserAuthUseCase,
} from './use-cases';

export const provideCreateImmediateChargeUseCase: Provider<CreateImmediateChargeUseCase> =
  {
    provide: CreateImmediateChargeUseCase,
    useFactory: (
      pspService: IPspService,
      eventEmitter: IEventEmitter,
      chargeRepository: IChargeRepository,
    ) => {
      return new CreateImmediateChargeUseCase(
        pspService,
        eventEmitter,
        chargeRepository,
      );
    },
    inject: [PspService, EventEmitter2, ChargeRepository],
  };

export const provideReceiveWebhookUseCase: Provider<ReceiveWebhookUseCase> = {
  provide: ReceiveWebhookUseCase,
  useFactory: (webhookRepository: IWebhookRepository) => {
    return new ReceiveWebhookUseCase(webhookRepository);
  },
  inject: [WebhookRepository],
};

export const providePspService: Provider<PspService> = {
  provide: PspService,
  useFactory: (celcoinApi: ICelcoinApi) => {
    return new PspService(celcoinApi);
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

export const provideRegisterUserUseCase: Provider<RegisterUserUseCase> = {
  provide: RegisterUserUseCase,
  useFactory: (userRepository: IUserRepository) => {
    return new RegisterUserUseCase(userRepository);
  },
  inject: [UserRepository],
};

export const provideUserAuthUseCase: Provider<UserAuthUseCase> = {
  provide: UserAuthUseCase,
  useFactory: (userRepository: IUserRepository) => {
    return new UserAuthUseCase(userRepository);
  },
  inject: [UserRepository],
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
  inject: [UserWebhookNotificationRepository, UserRepository],
};
