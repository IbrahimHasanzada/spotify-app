import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlbumEntity } from 'src/entities/album.entity';
import { Repository } from 'typeorm';
import { createAlbumDto } from './dto/create.dto';
import { ClsService } from 'nestjs-cls';
import { getAlbumDto } from './dto/get-album.dto';
import { ArtistEntity } from 'src/entities/artist.entity';
import { UpdateAlbumAdminDto, UpdateAlbumDto } from './dto/update-album.dto';
import { UserRole } from 'src/shares/enums/role.enum';

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private albumRepo: Repository<AlbumEntity>,
        @InjectRepository(ArtistEntity)
        private artistRepo: Repository<ArtistEntity>,
        private cls: ClsService
    ) { }

    async getAllAlbums(artistId: number) {
        let artist = await this.artistRepo.findOne({ where: { id: artistId } })

        if (!artist) throw new NotFoundException(`Artist is not found with ${artistId} id!`)

        let albums = await this.albumRepo.find({ where: { artistId } })

        if (!albums) throw new NotFoundException(`Album is not found ${artistId} id!`)

        return albums
    }

    async getAlbumById(albumId: number) {
        let album = await this.albumRepo.findOne({
            where: { id: albumId },
            relations: ['songs'],
            select: {
                id: true,
                title: true,
                releaseDate: true,
                songs: {
                    id: true,
                    audioUrl: true,
                    title: true,
                    playCount: true,
                    createdAt: true
                }
            }
        })

        if (!album) throw new NotFoundException(`Album is not found ${albumId} id!`)

        return album
    }

    async create(params: createAlbumDto) {
        let user = this.cls.get('user')
        if (!user.artist) throw new BadRequestException('You have not found Artist account')

        let album = this.albumRepo.create({
            artistId: user.artist.id,
            title: params.title,
            releaseDate: params.releaseDate
        })

        await album.save()
        return album
    }

    async updateAlbum(params: UpdateAlbumDto, albumId: number) {
        let user = this.cls.get('user')

        let album = await this.albumRepo.findOne({ where: { id: albumId } })

        if (!album) throw new NotFoundException(`Album is not found ${albumId} id!`)

        if (user.role == UserRole.Admin) {

            album.title = params.title || album.title

            album.releaseDate = params.releaseDate || album.releaseDate

            await album.save()

            return { message: "Album is updated successfully!" }
        }

        if (!user.artist) throw new BadRequestException('You have not found Artist account')

        if (user.artist.id !== album.artistId) throw new BadRequestException('You have not access to this api!')

        album.title = params.title || album.title
        album.releaseDate = params.releaseDate || album.releaseDate

        await album.save()

        return { message: "Album is updated successfully!" }
    }

    async createAdmin(params: createAlbumDto, artistId: number) {

        let artist = await this.artistRepo.findOne({ where: { id: artistId } })

        if (!artist) throw new NotFoundException(`Artist is not found ${artistId} id!`)

        let album = this.albumRepo.create({
            artistId: artist.id,
            title: params.title,
            releaseDate: params.releaseDate
        })

        await album.save()
        return album
    }

    async deleteAlbum(albumId: number) {
        let user = this.cls.get('user')

        let album = await this.albumRepo.findOne({ where: { id: albumId } })

        if (!album) throw new NotFoundException(`Album is not found ${albumId} id!`)

        if (user.role === UserRole.Admin) await this.albumRepo.delete(albumId)

        if (user.artist.id !== album?.artistId) throw new BadRequestException('You have not permission for delete this album!')


        await this.albumRepo.delete(albumId)

        return { message: "Album is deleted successfully!" }
    }
}