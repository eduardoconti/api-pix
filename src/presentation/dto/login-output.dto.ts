import { ApiProperty } from '@nestjs/swagger';

export class LoginOutput {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMGE0ZjJkOC1mMDE4LTRlYmUtOGM4Ni1lNjk4ZjAzMTZjNmUiLCJ1c2VyTmFtZSI6IkVkdWFyZG8gQ29udGkiLCJpYXQiOjE2Nzk3NjI0MTksImV4cCI6MTY3OTg0ODgxOX0.TBs0HgvFOJVscHqNffXKVml3qWcariYngtpQvRG4Ft8',
  })
  access_token!: string;
}
