import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { audioFileFilter } from './songs.filter';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { SongsService } from './songs.service';
import { UpdateAudiDto, UploadAudiDto } from './dto/upload-audio.dto';
import { Auth } from 'src/shares/decorators/auth.decorator';
import { UserRole } from 'src/shares/enums/role.enum';

@Controller('song')
export class SongsController {
    constructor(
        private songsService: SongsService
    ) { }

    @Get('search')
    @ApiOperation({ summary: "Search song's for genre" })
    async searchByGenre(@Query('genre') genre: string) {
        return await this.songsService.searchSongsByGenre(genre);
    }

    @Get(':songId')
    @ApiOperation({ summary: 'Get songs by id' })
    async getSongById(
        @Param('songId') songId: number
    ) {
        return await this.songsService.getSongById(songId)
    }

    @Post()
    @Auth(UserRole.ARTIST)
    @ApiOperation({ summary: 'Add songs by artist' })
    @UseInterceptors(FileInterceptor('audio', {
        storage: memoryStorage(),
        fileFilter: audioFileFilter,
        limits: {
            fileSize: 24 * 1024 * 1024
        }
    }))


    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: UploadAudiDto })
    async uploadAudio(@UploadedFile() file: Express.Multer.File, @Body() body: UploadAudiDto) {
        return await this.songsService.uploadAudio(file, body)
    }

    @Post(':songId')
    @Auth(UserRole.ARTIST, UserRole.Admin)
    @ApiOperation({ summary: 'Update songs by artist/admin' })
    async updateSong(
        @Body() body: UpdateAudiDto,
        @Param('songId') songId: number) {
        return await this.songsService.updateSong(body, songId)
    }

    @Delete(':songId')
    @Auth(UserRole.ARTIST, UserRole.Admin)
    @ApiOperation({ summary: 'Delete songs' })
    async deleteSong(
        @Param('songId') songId: number
    ) {
        return await this.songsService.deleteSong(songId)
    }
}