import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { PlaylistEntity } from 'src/entities/playlist.entity';
import { In, Repository } from 'typeorm';
import { AddSongsDto, CreatePlaylistDto, UpdatePlaylistDto } from './dto/create-playlist.dto';
import { UserEntity } from 'src/entities/user.entity';
import { UserRole } from 'src/shares/enums/role.enum';
import { SongsEntity } from 'src/entities/songs.entity';

@Injectable()
export class PlaylistService {
    constructor(
        @InjectRepository(PlaylistEntity)
        private playlistRepo: Repository<PlaylistEntity>,
        @InjectRepository(SongsEntity)
        private songsRepo: Repository<SongsEntity>,
        private cls: ClsService,
    ) { }

    async getPlaylistById(id: number) {

        let playlist = await this.playlistRepo.findOne({ where: { id }, relations: ["songs"] })

        if (!playlist) throw new NotFoundException('Playlist is not found with given id')

        if (!playlist.isPublic) {
            throw new ForbiddenException("You have not access to see this user's playlists.")
        }

        return playlist
    }

    async getPlaylistsByUserId(userId: number) {

        let playlists = await this.playlistRepo.find({ where: { userId, isPublic: true } })

        if (!playlists.length) throw new NotFoundException('Playlist is not found with given userId')

        return playlists
    }

    async update(playlistId: number, params: UpdatePlaylistDto) {
        let user = this.cls.get<UserEntity>('user')
        let playlist = await this.playlistRepo.findOne({ where: { id: playlistId } })
        if (!playlist) throw new NotFoundException('Playlist is not found with given id')
        if (user.role === UserRole.Admin) {
            Object.assign(playlist, params)
            await playlist.save()
            return { message: "Playlist is updated successfully" }
        }
        if (user.id !== playlist.userId) throw new ForbiddenException('You have not access do this api')

        Object.assign(playlist, params)
        await playlist.save()
        return { message: "Playlist is updated successfully" }
    }

    async create(params: CreatePlaylistDto) {
        let user = this.cls.get<UserEntity>('user')

        const playlist = this.playlistRepo.create({
            userId: user.id,
            name: params.name,
            description: params.description,
            isPublic: params.isPublic
        })

        await playlist.save()

        return playlist
    }

    findUserPlaylists(userId: number) {

    }

    async addSongs(id: number, params: AddSongsDto) {
        let user = this.cls.get<UserEntity>('user')
        const playlist = await this.playlistRepo.findOne({ where: { id }, relations: ["songs"] })

        if (!playlist) throw new NotFoundException("Playlist is not found with given id")

        if (user.id !== playlist.userId) throw new ForbiddenException('You can only modify your own playlists')

        const songs = await this.songsRepo.find({ where: { id: In(params.songIds) } })

        if (!songs.length) throw new NotFoundException("Song is not found with given id")

        if (!playlist.songs.length) {
            playlist.songs = songs
        } else {

            const existingSongIds = playlist.songs.map(song => song.id)

            const uniqueSongs = songs.filter(song => !existingSongIds.includes(song.id))

            playlist.songs = [...playlist.songs, ...uniqueSongs]
        }
        await playlist.save()

        return playlist


    }


    async removeSong(playlistId: number, songId: number) {
        let user = this.cls.get<UserEntity>('user')

        let playlist = await this.playlistRepo.findOne({ where: { id: playlistId }, relations: ["songs"] })

        if (!playlist) throw new NotFoundException('Playlist is not found with given id')

        if (user.role === UserRole.Admin) {

            let song = playlist.songs.filter(song => song.id == songId)
            if (!song.length) throw new NotFoundException('This song is not in your playlist')

            playlist.songs = playlist.songs.filter(song => song.id == songId)

            await playlist.save()

            return { message: "Song is successfully  deleted from the playlist" }
        }

        if (user.id !== playlist.userId) throw new ForbiddenException('You have not access do this api')

        let song = playlist.songs.filter(song => song.id == songId)

        if (!song.length) throw new NotFoundException('This song is not in your playlist')

        playlist.songs = playlist.songs.filter(song => song.id == songId)

        await playlist.save()

        return { message: "Song is successfully  deleted from the playlist" }
    }

    async deletePlaylist(playlistId: number) {
        let user = this.cls.get('user')

        const playlist = await this.playlistRepo.findOne({ where: { id: playlistId } })

        if (!playlist) throw new NotFoundException("Playlist is not found with given id")
        if (user.role === UserRole.Admin) {
            await this.playlistRepo.delete({ id: playlistId })
        } else {

            if (playlist?.userId !== user.id) throw new ForbiddenException('You can only delete your own playlists')

            await this.playlistRepo.delete({ id: playlistId })
        }
        return {
            message: "Playlist deleted successfully"
        }
    }
}

