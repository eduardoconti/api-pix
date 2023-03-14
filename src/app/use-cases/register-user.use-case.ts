import { UserAlreadyExistsException } from '@app/exceptions';

import { IUseCase, IUserRepository } from '@domain/core';
import { UserEntity, WebhookTypes } from '@domain/entities';
import { Email } from '@domain/value-objects';

export type RegisterUserUseCaseOutput = Omit<
  RegisterUserUseCaseInput,
  'password'
> & { id: string };
export type RegisterUserUseCaseInput = {
  name: string;
  email: string;
  password: string;
  webhookHost?: { type: WebhookTypes; host: string }[];
};

export type IRegisterUserUseCase = IUseCase<
  RegisterUserUseCaseInput,
  RegisterUserUseCaseOutput
>;
export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute({
    name,
    email,
    password,
    webhookHost,
  }: RegisterUserUseCaseInput) {
    if (await this.userRepository.exists(new Email(email))) {
      throw new UserAlreadyExistsException();
    }
    const userEntity = await UserEntity.create({
      name,
      email,
      password,
      webhookHost,
    });

    const saved = await this.userRepository.save(userEntity);
    const userProps = UserEntity.toPrimitives(saved);

    return {
      name: userProps.name,
      email: userProps.email,
      webhookHost: userProps.webhookHost?.map(({ type, host }) => {
        return {
          type,
          host,
        };
      }),
      id: saved.id.value,
    };
  }
}
