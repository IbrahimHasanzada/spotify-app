import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsNumber, IsOptional } from "class-validator";
import { PremiumEnum } from "src/shares/enums/premium.enum";

export class PremiumSubscriptionFeaturesDto {
    @Type()
    @IsEnum(PremiumEnum)
    @ApiProperty({ default: PremiumEnum.INDIVIDUAL })
    type: PremiumEnum;

    @Type()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Value must be a number with max 2 decimal places' })
    price: number;

    @Type()
    @IsNumber()
    maxUsers: number;

    @Type()
    @IsBoolean()
    @ApiProperty({ default: false })
    adFree: boolean;

    @Type()
    @IsBoolean()
    @ApiProperty({ default: false })
    offlineMode: boolean;

    @Type()
    @IsBoolean()
    @ApiProperty({ default: false })
    highQualityAudio: boolean;

    @Type()
    @IsBoolean()
    requiresStudentVerification: boolean;
}

