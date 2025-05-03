import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class createAlbumDto {

    @Type()
    @IsString()
    @ApiProperty({default: 'Album title'})
    title: string

    @Type()
    @IsDate()
    @ApiProperty()
    releaseDate: Date

}