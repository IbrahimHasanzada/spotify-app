import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsAlphanumeric, IsDate, IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { IsAdult } from "src/shares/decorators/is-adult.decorator";
import { UserGender } from "src/shares/enums/gender.enum";

export class RegisterAuthDto {
    @Type()
    @IsString()
    @MinLength(3)
    @ApiProperty({ default: 'john doe' })
    fullname: string

    @Type()
    @IsAlphanumeric()
    @MinLength(10)
    @ApiProperty({ default: 'john123456' })
    password: string

    @Type()
    @IsString()
    @ApiProperty({ default: 'Azerbaijan' })
    country: string

    @Type()
    @IsEmail()
    @ApiProperty({ default: 'test@example.com' })
    email: string

    @Type()
    @IsDate()
    @ApiProperty()
    @IsAdult({ message: 'User must be at least 13 years old' })
    birth: Date

    @Type()
    @IsEnum(UserGender)
    @ApiProperty({ default: UserGender.Male })
    gender: UserGender
}