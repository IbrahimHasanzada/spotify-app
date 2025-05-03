import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsEnum, IsOptional, IsString, IsUUID, Length } from "class-validator";
import { IsAdult } from "src/shares/decorators/is-adult.decorator";
import { UserGender } from "src/shares/enums/gender.enum";
import { UserRole } from "src/shares/enums/role.enum";

export class UpdateProfileDto {
    @Type()
    @IsString()
    @Length(5, 50)
    @ApiProperty({ default: 'John Doe' })
    fullname: string

    @Type()
    @IsOptional()
    @IsUUID()
    @IsString()
    @ApiProperty({ default: "56bacdab-ac0c-4001-8412-0312e0343c25" })
    imageId?: string;

    @Type()
    @IsString()
    @IsOptional()
    @ApiProperty({ default: 'Azerbaijan' })
    country: string

    @Type()
    @IsEmail()
    @IsOptional()
    @ApiProperty({ default: 'test@example.com' })
    email?: string

    @Type()
    @IsDate()
    @ApiProperty()
    @IsOptional()
    @IsAdult({ message: 'User must be at least 13 years old' })
    birth: Date

    @Type()
    @IsEnum(UserGender)
    @IsOptional()
    @ApiProperty({ default: UserGender.Male })
    gender: UserGender
}

export class updateProfileAdminDto {
    @Type()
    @IsString()
    @Length(5, 50)
    @ApiProperty({ default: 'John Doe' })
    fullname: string

    @Type()
    @IsOptional()
    @IsUUID()
    @IsString()
    @ApiProperty({ default: "56bacdab-ac0c-4001-8412-0312e0343c25" })
    imageId?: string;

    @Type()
    @IsString()
    @IsOptional()
    @ApiProperty({ default: 'Azerbaijan' })
    country: string

    @Type()
    @IsEmail()
    @IsOptional()
    @ApiProperty({ default: 'test@example.com' })
    email?: string

    @Type()
    @IsDate()
    @ApiProperty()
    @IsOptional()
    @IsAdult({ message: 'User must be at least 13 years old' })
    birth: Date

    @Type()
    @IsEnum(UserGender)
    @IsOptional()
    @ApiProperty({ default: UserGender.Male })
    gender: UserGender

    @Type()
    @IsEnum(UserRole)
    @IsOptional()
    @ApiProperty({ default: UserRole.User })
    role: UserRole


}