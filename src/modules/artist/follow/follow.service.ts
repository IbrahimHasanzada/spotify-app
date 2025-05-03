import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { ArtistEntity } from 'src/entities/artist.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowService {
    constructor(
        private cls: ClsService,
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(ArtistEntity)
        private artistRepository: Repository<ArtistEntity>,
    ) { }

    async followArtist(artistId: number) {
        let user = this.cls.get<UserEntity>('user')

        const artist = await this.artistRepository.findOne({
            where: { id: artistId },
        })

        if (!artist) throw new NotFoundException(`Artist with ID ${artistId} not found`)

        const isAlreadyFollowing = user.followingArtists?.some(a => a.id == artistId);

        if (isAlreadyFollowing) throw new ConflictException(`User already follows artist with ID ${artistId}`)
        if (!user.followingArtists) {
            user.followingArtists = []
        }

        user.followingArtists.push(artist)

        artist.followCount += 1;

        await artist.save()

        return await user.save()
    }

    async unfollowArtist(artistId: number) {
        const user = this.cls.get('user')

        const artist = await this.artistRepository.findOne({
            where: { id: artistId },
        });

        if (!artist) {
            throw new NotFoundException(`Artist with ID ${artistId} not found`);
        }

        const isFollowing = user.followingArtists.map(a => a.id)

        if (!isFollowing.includes(artistId)) throw new ConflictException(`User does not follow artist with ID ${artistId}`)

        user.followingArtists = user.followingArtists.filter(a => a.id != artistId);

        if (artist.followCount > 0) {
            artist.followCount = artist.followCount - 1;
            await artist.save()
        }

        await user.save()
        return {
            message: "Profile successfullt unfollowed"
        }
    }

    async getArtistFollowers(artistId: number) {
        const artist = await this.artistRepository.findOne({
            where: { id: artistId },
            relations: ['followers'],
            select: {
                user: {
                    id: true,
                    fullname: true,
                    country: true,
                    email: true,
                    profile: {
                        imageId: true
                    }
                }
            }
        })

        if (!artist) throw new NotFoundException(`Artist with ID ${artistId} not found`)

        return artist.followers || [];
    }

    async getUserFollowing(userId?: number) {
        let user
        if (userId) {
            user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['followingArtists'],
            })

            if (!user) {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }
        } else {
            user = this.cls.get('user')
        }


        return user || [];
    }
    async getMyUserFollowing(userId?: number) {
        let user = this.cls.get('user')

        return user || [];
    }

    async checkFollowStatus(artistId: number, userId?: number) {
        let user;
        if (userId) {
            user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['followingArtists'],
            });
            if (!user) throw new NotFoundException(`User with ID ${userId} not found`);
        } else {
            user = this.cls.get('user');
            if (!user) throw new UnauthorizedException('User not authenticated');
        }

        return user.followingArtists?.some(artist => artist.id == artistId) || false;
    }
}