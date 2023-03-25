import { Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserAuthUseCaseOutput } from '@app/use-cases';

import { User } from '@infra/decorators/user.decorator';
import { LocalAuthGuard } from '@infra/guard';

import {
  ApiSuccessResponse,
  ApiUnauthorizedErrorResponse,
} from '@presentation/__docs__';
import { LoginInput, LoginOutput } from '@presentation/dto';

@Controller()
@ApiTags('auth')
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @ApiBody({ type: LoginInput })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiUnauthorizedErrorResponse({
    title: 'UnauthorizedException',
    detail: 'invalid credentials',
  })
  @ApiSuccessResponse({
    model: LoginOutput,
    statusCode: HttpStatus.CREATED,
  })
  @ApiOperation({
    summary: 'Autenticação',
  })
  async handle(@User() user: UserAuthUseCaseOutput) {
    return {
      access_token: await this.jwtService.signAsync(user),
    };
  }
}
