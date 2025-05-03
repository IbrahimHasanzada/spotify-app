import { Type } from "class-transformer";
import { IsNumber, IsPositive } from "class-validator";

export class ArtistsAlbumDto {
    @Type()
    @IsNumber()
    @IsPositive()
    artistId: number
}