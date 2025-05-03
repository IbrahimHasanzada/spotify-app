import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class CreateArtistDto {
    @Type()
    @IsString()
    @MinLength(5)
    @ApiProperty({default: "John Doe is 5 year experienced musician"})
    bio: string
} 