import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

// 커스텀 파이프 생성
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  // value - 현재 파이프에 전달된 인자
  // metadata - 현재 파이프에 전달된 인자의 메타데이터
  // transform(value: any, metadata: ArgumentMetadata) {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // console.log(metadata);
    // console.log(metatype); // [class CreateUserDto]

    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value); // object to class
    /*
    CreateUserDto {
      username: 'ejejej',
      email: 'ej@naver.com',
      password: '1234'
    }
    */
    // console.log(object);

    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];

    return !types.includes(metatype);
  }
}
