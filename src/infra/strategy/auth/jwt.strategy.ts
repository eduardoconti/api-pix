import { Injectable } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenPayload } from '@app/contracts';
import { UserAuthUseCaseOutput } from '@app/use-cases';

import { EnvironmentVariables } from '@main/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: async (_request: any, _token: any, done: any) => {
        const secret = this.configService.getOrThrow('JWT_KEY');
        done(null, secret);
      },
    });
  }

  async validate({
    userId,
    userName,
  }: UserAuthUseCaseOutput): Promise<TokenPayload> {
    return {
      userName,
      userId,
    };
  }
}
