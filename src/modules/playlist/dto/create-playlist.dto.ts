import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePlaylistDto {
    @Type()
    @IsString()
    @ApiProperty({ default: "Playlist name" })
    name: string;

    @Type()
    @IsOptional()
    @IsString()
    @ApiProperty({ default: "Playlist description" })
    description?: string;

    @Type()
    @IsOptional()
    @IsBoolean()
    @ApiProperty({ default: false })
    isPublic?: boolean;
}

export class UpdatePlaylistDto {
    @Type()
    @IsOptional()
    @IsString()
    @ApiProperty({ default: "Playlist name" })
    name?: string;

    @Type()
    @IsOptional()
    @IsString()
    @ApiProperty({ default: "Playlist description" })
    description?: string;

    @Type()
    @IsOptional()
    @IsBoolean()
    @ApiProperty({ default: false })
    isPublic?: boolean;
}

export class AddSongsDto {
    @Type()
    @IsArray()
    @IsNumber({}, { each: true })
    @ApiProperty({ default: [] })
    songIds: number[];
}