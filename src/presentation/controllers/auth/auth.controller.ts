import { Controller, Req, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UserAuthUseCaseOutput } from '@app/use-cases';

import { LocalAuthGuard } from '@infra/guard';

@Controller()
export class AuthController {
  constructor(private jwtService: JwtService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request) {
    return {
      access_token: await this.jwtService.signAsync(
        req.user as UserAuthUseCaseOutput,
      ),
    };
  }
}
