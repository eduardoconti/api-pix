import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let jwtService: JwtService;
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = app.get(AuthController);
    jwtService = app.get(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('should execute controller with all fields', async () => {
    jest
      .spyOn(jwtService, 'signAsync')
      .mockResolvedValue(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZWE0NTkxZi1jMGEwLTQ4MzktYTdiYi0wM2Y2ODRlOTA3N2UiLCJ1c2VyTmFtZSI6IkVkdWFyZG8gQ29udGkiLCJpYXQiOjE2NzkxODIxMzEsImV4cCI6MTY3OTI2ODUzMX0.ftY-2_j0Q2xooi6vxNn8SlgI-HMwCh8Sckgi_3yw2qA',
      );
    const result = await controller.handle({
      userId: 'any',
      userName: 'any',
    });
    expect(result).toStrictEqual(
      expect.objectContaining({
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZWE0NTkxZi1jMGEwLTQ4MzktYTdiYi0wM2Y2ODRlOTA3N2UiLCJ1c2VyTmFtZSI6IkVkdWFyZG8gQ29udGkiLCJpYXQiOjE2NzkxODIxMzEsImV4cCI6MTY3OTI2ODUzMX0.ftY-2_j0Q2xooi6vxNn8SlgI-HMwCh8Sckgi_3yw2qA',
      }),
    );
    expect(jwtService.signAsync).toBeCalled();
  });
});
