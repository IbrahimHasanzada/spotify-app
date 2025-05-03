import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UploadAudiDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    audio: string

    @ApiProperty({ type: 'string', description: 'Song title' })
    title: string;

    @Type()
    @IsString()
    @ApiProperty()
    genre: string

    @Type()
    @IsNumber()
    @ApiProperty()
    albumId: number
}

export class UpdateAudiDto {
    @ApiProperty({ type: 'string', description: 'Song title' })
    title: string;

    @Type()
    @IsNumber()
    @ApiProperty()
    @IsOptional()
    albumId: number

    @Type()
    @IsString()
    @ApiProperty()
    genre: string
}