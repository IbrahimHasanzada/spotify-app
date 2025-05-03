import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { Auth } from 'src/shares/decorators/auth.decorator';
import { UserRole } from 'src/shares/enums/role.enum';
import { CreateArtistDto } from './dto/create.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('artist')
export class ArtistController {
    constructor(
        private artistService: ArtistService
    ) { }


    @Get('popular')
    @ApiOperation({ summary: 'Get popular artists sorted by follower count' })
    async getPopularArtists(@Query('limit') limit?: number) {
        return await this.artistService.getPopularArtists(limit ? +limit : 10);
    }

    @Get()
    @ApiOperation({ summary: 'Get all artists' })
    async getArtists() {
        return await this.artistService.getArtist()
    }


    @Get(':artistId')
    @ApiOperation({ summary: 'Get artist by id' })
    async getArtistsById(
        @Param('artistId') artistId: number
    ) {
        return await this.artistService.getArtistById(artistId)
    }

    @Post()
    @Auth(UserRole.ARTIST)
    @ApiOperation({ summary: 'Create or update artist by artist. If there is an artist, he/she updates him/her, if not, he/she creates him/her' })
    async upsert(@Body() body: CreateArtistDto) {
        return await this.artistService.upsert(body)
    }

    @Post(':userId')
    @Auth(UserRole.Admin)
    @ApiOperation({ summary: 'Create or update artist by admin. If there is an artist, he/she updates him/her, if not, he/she creates him/her' })
    async upsertAdmin(@Body() body: CreateArtistDto, @Param('artistId') userId: number) {
        return await this.artistService.upsertAdmin(body, userId)
    }

    @Delete()
    @Auth(UserRole.ARTIST)
    @ApiOperation({ summary: 'Delete artist account by artist' })
    async deleteArtist() {
        return await this.artistService.deleteArtist()
    }

    @Delete(':artistId')
    @Auth(UserRole.Admin)
    @ApiOperation({ summary: 'Delete artist account by admin' })
    async deleteArtistAdmin(@Param('artistId') artistId: number) {
        return await this.artistService.deleteArtistAdmin(artistId)
    }
}