import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: '이름' })
  readonly username: string;

  @ApiProperty({ description: '이메일' })
  readonly email: string;

  @ApiProperty({ description: '?' })
  readonly bio: string;

  @ApiProperty({ description: '프로필이미지' })
  readonly image: string;
}
