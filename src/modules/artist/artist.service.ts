import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { ArtistEntity } from 'src/entities/artist.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UserRole } from 'src/shares/enums/role.enum';
import { Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ArtistService {
    constructor(
        @InjectRepository(ArtistEntity)
        private artistRepo: Repository<ArtistEntity>,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        private cls: ClsService,
        private userService: UserService
    ) { }

    async getArtist() {
        return await this.artistRepo.findOne({
            relations: ['user'],
            select: {
                id: true,
                bio: true,
                followers: true,
                user: {
                    fullname: true,
                    country: true,
                }
            }
        })
    }

    async getArtistById(id: number) {
        let artist = await this.artistRepo.findOne({
            where: { id },
            relations: ['user'],
            select: {
                id: true,
                bio: true,
                followers: true,
                user: {
                    fullname: true,
                    country: true,
                }
            }
        })

        if (!artist) throw new NotFoundException(`Artist is not found with ${id} id!`)

        return artist
    }


    async upsert(params: CreateArtistDto) {
        let user = this.cls.get('user')
        let artist: any

        if (user.artist) {
            artist = await this.artistRepo.update({ id: user.artist.id }, { bio: params.bio })
        } else {
            artist = this.artistRepo.create({
                userId: user.id,
                bio: params.bio
            })
            await artist.save()
        }

        return user.artist ? { message: "Artist successfully updated!" } : artist

    }

    async upsertAdmin(params: CreateArtistDto, userId: number) {
        let user = await this.userService.getUser(userId)

        if (!user) throw new NotFoundException(`User is not found with ${userId} id!`)

        let artist: any

        if (user.artist) {
            artist = await this.artistRepo.update({ id: user.artist.id }, { bio: params.bio })
        } else {
            artist = this.artistRepo.create({
                userId: user.id,
                bio: params.bio
            })
            await artist.save()
        }


        return user.artist ? { message: "Artist successfully updated!" } : artist

    }

    async deleteArtist() {
        let user = this.cls.get('user')

        if (!user.artist) throw new NotFoundException("You have not an artist account")

        await this.artistRepo.delete({ id: user.artist.id })

        return {
            message: "Artist successfully deleted!"
        }
    }

    async deleteArtistAdmin(artistId: number) {
        let artist = await this.artistRepo.findOne({ where: { id: artistId } })

        if (!artist) throw new NotFoundException(`Artist is not found with ${artistId} id!`)

        await this.artistRepo.delete({ id: artist.id })

        return {
            message: "Artist successfully deleted!"
        }
    }
    async getPopularArtists(limit: number = 10): Promise<ArtistEntity[]> {
        return await this.artistRepo
            .createQueryBuilder('artist')
            .leftJoinAndSelect('artist.albums', 'Albums')
            .leftJoinAndSelect('artist.user', 'User')
            .orderBy('artist.followers', 'DESC')
            .take(limit)
            .getMany();
    }

}