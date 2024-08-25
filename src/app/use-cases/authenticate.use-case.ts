import { IUseCase, IUserRepository } from '@domain/core';
import { Email, Password } from '@domain/value-objects';

import { UnauthorizedException } from '@infra/exceptions';

export type AuthenticateInput = {
  userName: string;
  password: string;
};

export type AuthenticateOutput = {
  userId: string;
  userName: string;
};

export type IAuthenticateUseCase = IUseCase<
  AuthenticateInput,
  AuthenticateOutput
>;
export class Authenticate implements IAuthenticateUseCase {
  constructor(private readonly userRepository: IUserRepository) {}
  async execute({ userName, password }: AuthenticateInput) {
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
