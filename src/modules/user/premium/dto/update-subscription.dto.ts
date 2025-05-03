import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum } from "class-validator";
import { PremiumEnum } from "src/shares/enums/premium.enum";

export class UpdatePremiumSubscriptionDto {
    @Type()
    @IsEnum(PremiumEnum)
    @ApiProperty({ default: PremiumEnum.INDIVIDUAL })
    type: PremiumEnum;
}

