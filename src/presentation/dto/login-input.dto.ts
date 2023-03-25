import { ApiProperty } from '@nestjs/swagger';

export class LoginInput {
  @ApiProperty({
    example: 'teste@gmail.com',
  })
  email!: string;

  @ApiProperty({
    example: 'teste@123',
  })
  password!: string;
}
