import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAlbumDto {

    @Type()
    @IsString()
    @ApiProperty({ default: 'Album title' })
    title: string

    @Type()
    @IsDate()
    @ApiProperty()
    releaseDate: Date

}

export class UpdateAlbumAdminDto {

    @Type()
    @IsString()
    @ApiProperty({ default: 'Album title' })
    title: string

    @Type()
    @IsDate()
    @ApiProperty()
    @IsOptional()
    releaseDate: Date

    @Type()
    @IsNumber()
    @IsOptional()
    artistId: number

}