import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';

import { UserAuthUseCaseOutput } from '@app/use-cases';

import { User } from '@infra/decorators/user.decorator';
import { LocalAuthGuard } from '@infra/guard';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async handle(@User() user: UserAuthUseCaseOutput) {
    return {
      access_token: await this.jwtService.signAsync(user),
    };
  }
}
