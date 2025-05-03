import { Type } from "class-transformer";
import { IsNumber, IsPositive } from "class-validator";

export class ArtistsAlbumsSongDto {
    @Type()
    @IsNumber()
    @IsPositive()
    albumId: number
}