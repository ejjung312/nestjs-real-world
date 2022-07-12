import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions
} from 'class-validator';

// 커스텀 데코레이션 - 유효성 검사기
export function NotIn(property: string, validationOptions?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      name: 'NotIn', // 데코레이션 이름
      target: object.constructor, // 객체가 생성될 때 데코레이터 적용됨
      propertyName,
      options: validationOptions, // 유효성 옵션을 데코레이션의 인자로 전달받은 것을 사용
      constraints: [property], // 속성에 적용되도록 제약
      validator: {
        // 유효성 검사
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints; // destructuring arrays
          const relatedValue = (args.object as any)[relatedPropertyName];

          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            !relatedValue.includes(value)
          );
        },
      },
    });
  };
}
