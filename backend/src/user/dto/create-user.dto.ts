import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ description: '이름' })
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: '이메일' })
  readonly email: string;

  @IsNotEmpty()
  @ApiProperty({ description: '비밀번호' })
  readonly password: string;
}
