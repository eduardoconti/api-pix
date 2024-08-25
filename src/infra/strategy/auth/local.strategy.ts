import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { IAuthenticateUseCase, Authenticate } from '@app/use-cases';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Authenticate)
    private authService: IAuthenticateUseCase,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.execute({
      userName: email,
      password,
    });
    return user;
  }
}
