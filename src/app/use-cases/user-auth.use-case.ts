import { IUseCase, IUserRepository } from '@domain/core';
import { Email, Password } from '@domain/value-objects';

import { UnauthorizedException } from '@infra/exceptions';

export type UserAuthUseCaseInput = {
  userName: string;
  password: string;
};

export type UserAuthUseCaseOutput = {
  userId: string;
  userName: string;
};

export type IUserAuthUseCase = IUseCase<
  UserAuthUseCaseInput,
  UserAuthUseCaseOutput
>;
export class UserAuthUseCase implements IUserAuthUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute({ userName, password }: UserAuthUseCaseInput) {
    const user = await this.userRepository.findOne({
      email: new Email(userName),
    });

    if (!(await Password.compareHash(password, user.props.password.value))) {
      throw new UnauthorizedException('invalid credentials');
    }
    return {
      userId: user.id.value,
      userName: user.props.name.value,
    };
  }
}
