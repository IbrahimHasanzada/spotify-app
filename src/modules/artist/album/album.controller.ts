import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { Auth } from 'src/shares/decorators/auth.decorator';
import { UserRole } from 'src/shares/enums/role.enum';
import { createAlbumDto } from './dto/create.dto';
import { AlbumService } from './album.service';
import { UpdateAlbumAdminDto, UpdateAlbumDto } from './dto/update-album.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('artist')
export class AlbumController {
    constructor(
        private albumService: AlbumService
    ) { }

    @Post('album/me')
    @Auth(UserRole.ARTIST)
    @ApiOperation({ summary: "Add album by artist" })
    async create(@Body() body: createAlbumDto) {
        return await this.albumService.create(body)
    }
    @Get('/:artistId/album')
    @ApiOperation({ summary: 'Get album by artisId' })
    async getAlbums(@Param('artistId') artistId: number) {
        return await this.albumService.getAllAlbums(artistId)
    }


    @Get('album/:albumId')
    @ApiOperation({ summary: 'Get album by id' })
    async getAlbumById(
        @Param('albumId') albumId: number
    ) {
        return await this.albumService.getAlbumById(albumId)
    }



    @Post(':artistId/album')
    @Auth(UserRole.Admin)
    @ApiOperation({ summary: "Add album to artist's account by Admin" })
    async createAdmin(@Body() body: createAlbumDto, @Param('artistId') artistId: number) {
        return await this.albumService.createAdmin(body, artistId)
    }

    @Post('album/:albumId')
    @Auth(UserRole.ARTIST, UserRole.Admin)
    @ApiOperation({ summary: "Update album by admin or artist. If user is admin he/she can update all account, but artist only can update his/her album" })
    async updateAlbum(
        @Body() body: UpdateAlbumDto,
        @Param('albumId') albumId: number
    ) {
        return await this.albumService.updateAlbum(body, albumId)
    }

    @Delete('album/:albumId')
    @Auth(UserRole.ARTIST, UserRole.Admin)
    @ApiOperation({ summary: "Delete album by admin or artist. If user is admin he/she can delete all account, but artist only can delete his/her album" })
    async deleteAlbum(@Param('albumId') albumId: number) {
        return await this.albumService.deleteAlbum(albumId)
    }
}