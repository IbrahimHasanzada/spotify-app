import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsAdult(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsAdult',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const birthDate = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();

                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                        return age - 1 >= 13;
                    }

                    return age >= 13;
                },
                defaultMessage(args: ValidationArguments) {
                    return 'User must be at least 18 years old';
                },
            },
        });
    };
}