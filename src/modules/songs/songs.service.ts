import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { SongsEntity } from 'src/entities/songs.entity';
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service';
import { ILike, NumericType, Repository } from 'typeorm';
import { UpdateAudiDto, UploadAudiDto } from './dto/upload-audio.dto';
import { AlbumEntity } from 'src/entities/album.entity';
import { UserRole } from 'src/shares/enums/role.enum';

@Injectable()
export class SongsService {
    constructor(
        private cloudinaryService: CloudinaryService,
        @InjectRepository(SongsEntity)
        private songsRepo: Repository<SongsEntity>,
        @InjectRepository(AlbumEntity)
        private albumRepo: Repository<AlbumEntity>,
        private cls: ClsService
    ) { }


    async getSongById(songId: number) {

        let song = await this.songsRepo.findOne({ where: { id: songId } })

        if (!song) throw new NotFoundException(`Song is not found ${songId} id!`)

        return {
            ...song,
            artistId: undefined,
            albumId: undefined
        }
    }

    async searchSongsByGenre(genre: string) {
        if (!genre) throw new NotFoundException('Genre query parameter is required')
        const songs = await this.songsRepo.find({
            where: {
                genre: ILike(`%${genre}%`),
            },
        })

        if (!songs.length) throw new NotFoundException(`No songs found matching genre: ${genre}`)
       
            return songs;
    }

    async uploadAudio(audio: Express.Multer.File, params: UploadAudiDto) {
        let user = this.cls.get('user')
        let album = await this.albumRepo.findOne({ where: { id: params.albumId } })

        if (!album) throw new NotFoundException(`Album is not found ${params.albumId} id!`)

        if (album.artistId !== user.artist.id) throw new ForbiddenException('You have not acces for do this api!')

        try {
            let result = await this.cloudinaryService.uploadFile(audio)
            if (!result?.url) throw new Error()
            let song = this.songsRepo.create({
                title: params.title,
                audioUrl: result.url,
                albumId: params.albumId,
                artistId: user.artist.id,
                genre: params.genre
            })

            await song.save()
            return song
        } catch (err) {
            throw new BadRequestException('Something went wrong');
        }
    }

    async updateSong(params: UpdateAudiDto, songId: number) {
        let user = this.cls.get('user')

        let song = await this.songsRepo.findOne({ where: { id: songId } })

        if (!song) throw new NotFoundException(`This song is not found with ${songId} id!`)

        if (user.role === UserRole.Admin) {

            await this.songsRepo.update({ id: songId }, params)

            return { message: "Song is updated successfully!" }
        }

        if (user.artist.id !== song?.artistId) throw new BadRequestException('You have not acces to this api!')

        await this.songsRepo.update({ id: songId }, params)

        return { message: "Song is updated successfully!" }
    }


    async deleteSong(songId: number) {
        let user = this.cls.get('user')

        let song = await this.songsRepo.findOne({ where: { id: songId } })

        if (!song) throw new NotFoundException(`Song is not found ${songId} id!`)

        if (user.role === UserRole.Admin) {

            await this.songsRepo.delete(songId)

            return { message: "Song is deleted successfully" }
        }

        if (!user.artist) throw new BadRequestException('You have not an artist account')

        if (user.artist.id !== song?.artistId) throw new BadRequestException('You have not access to this api')

        await this.songsRepo.delete(songId)

        return { message: "Song is deleted successfully" }
    }
}