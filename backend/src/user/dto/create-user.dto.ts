import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength
} from 'class-validator';
import { NotIn } from '../notin.decorator';

export class CreateUserDto {
  // transform으로 유효성 검사
  // @Transform(({ value, obj }) => {
  //   if (obj.password.includes(value.trim())) {
  //     throw new BadRequestException(
  //       'password는 name과 같은 문자열을 포함할 수 없습니다.',
  //     );
  //   }
  //   return value.trim();
  // })
  @Transform((params) => params.value.trim())
  // 유효성 데코레이션
  @NotIn('password', {
    message: 'password는 name과 같은 문자열을 포함할 수 없습니다.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'too short' })
  @MaxLength(30)
  @ApiProperty({ description: '이름' })
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(60)
  @ApiProperty({ description: '이메일' })
  readonly email: string;

  @IsNotEmpty()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  @ApiProperty({ description: '비밀번호' })
  readonly password: string;
}
