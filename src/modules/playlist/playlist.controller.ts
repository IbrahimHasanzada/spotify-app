import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { AddSongsDto, CreatePlaylistDto, UpdatePlaylistDto } from './dto/create-playlist.dto';
import { Auth } from 'src/shares/decorators/auth.decorator';
import { ApiOperation } from '@nestjs/swagger';

@Controller('playlist')
export class PlaylistController {
    constructor(
        private playlistService: PlaylistService
    ) { }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get playlists by user id' })
    async getPlaylistsByUserId(@Param('userId') userId: number) {
        return await this.playlistService.getPlaylistsByUserId(userId);
    }

    @Get('single/:playlistId')
    @ApiOperation({ summary: 'Get playlist by id' })
    getPlaylistById(@Param('playlistId') playlistId: number) {
        return this.playlistService.getPlaylistById(playlistId);
    }

    @Post()
    @Auth()
    @ApiOperation({ summary: 'Create new playlist' })
    async create(@Body() body: CreatePlaylistDto) {
        return await this.playlistService.create(body);
    }

    @Post(':playlistId')
    @Auth()
    @ApiOperation({ summary: 'Update playlist by id. Admin can update all playlists, but user can only update own playlist' })
    async update(
        @Param('playlistId') playlistId: number,
        @Body() body: UpdatePlaylistDto
    ) {
        return await this.playlistService.update(playlistId, body)
    }

    @Post(':playlistId/song')
    @Auth()
    @ApiOperation({ summary: 'Add song to playlist' })
    async addSongs(
        @Param('playlistId') playListId: number,
        @Body() body: AddSongsDto
    ) {
        return await this.playlistService.addSongs(playListId, body);
    }

    @Delete(':playListId/song/:songId')
    @Auth()
    @ApiOperation({ summary: 'Remove song from playlist. Admin can delete song from all playlists. But user an only delete song from own playlist' })
    async removeSong(
        @Param('playlistId') playlistId: number,
        @Param('songId') songId: number
    ) {
        return await this.playlistService.removeSong(playlistId, songId)
    }

    @Delete(':playlistId')
    @Auth()
    @ApiOperation({ summary: "Delete playlists. User can delete own playlists, but admin can delete everyone's playlists" })
    async delete(@Param('playlistId') playlistId: number) {
        return await this.playlistService.deletePlaylist(playlistId);
    }
}