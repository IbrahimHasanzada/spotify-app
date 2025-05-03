import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClsService } from 'nestjs-cls';
import { ProfileEntity } from 'src/entities/profile.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { updateProfileAdminDto, UpdateProfileDto } from './dto/update-profile.dto';
import { UserRole } from 'src/shares/enums/role.enum';
import { ArtistEntity } from 'src/entities/artist.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        @InjectRepository(ProfileEntity)
        private profileRepo: Repository<ProfileEntity>,
        @InjectRepository(ArtistEntity)
        private artistEntity: Repository<ArtistEntity>,
        private cls: ClsService
    ) { }

    async getUser(id: number) {
        return await this.userRepo.findOne({
            where: { id },
            relations: ['profile', 'profile.premiumSubscription', 'artist', 'followingArtists'],
            select: {
                id: true,
                fullname: true,
                gender: true,
                role: true,
                birth: true,
                country: true,
                provider: true,
                followingArtists: true,
                profile: {
                    id: true,
                    imageId: true,
                    premiumSubscription: {
                        id: true,
                        type: true,
                        price: true,
                        maxUsers: true,
                        adFree: true,
                        offlineMode: true,
                        highQualityAudio: true,
                        requiresStudentVerification: true
                    },
                },
                artist: {
                    id: true,
                    bio: true,
                    followers: true,
                }
            }
        })

    }

    async getAllProfile() {
        return await this.userRepo.find()
    }

    async getProfile(userId: number) {
        userId = userId || this.cls.get<UserEntity>('user')?.id
        const user = await this.userRepo.findOne({
            where: { id: userId },
            select: {
                id: true,
                fullname: true,
                gender: true,
                role: true,
                birth: true,
                country: true,
                provider: true,
                profile: { id: true },
            },
            relations: {
                profile: {
                    image: true,
                    premiumSubscription: true
                },
                artist: true
            }
        });

        if (!user) throw new NotFoundException("User is not found!")

        return {
            ...user,
            password: undefined,
            email: undefined
        }
    }

    async getMyProfile() {
        let userId = this.cls.get<UserEntity>('user')?.id
        let user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['profile', 'profile.premiumSubscription'],
            select: {
                id: true,
                fullname: true,
                gender: true,
                role: true,
                birth: true,
                country: true,
                provider: true,
                profile: {
                    id: true,
                    imageId: true,
                    premiumSubscription: {
                        id: true,
                        type: true,
                        price: true,
                        maxUsers: true,
                        adFree: true,
                        offlineMode: true,
                        highQualityAudio: true,
                        requiresStudentVerification: true
                    },
                }
            }
        })

        if (!user) throw new NotFoundException("User is not found!")

        return {
            ...user,
            password: undefined,
            email: undefined
        }
    }


    async updateMyProfile(params: UpdateProfileDto) {
        let user = this.cls.get<UserEntity>('user');

        if (params.email) {
            const existingUser = await this.userRepo.findOne({
                where: { email: params.email }
            });

            if (existingUser && existingUser.id !== user.id) {
                throw new ConflictException('Email already exists');
            }
        }
        user.fullname = params.fullname || user.fullname;
        user.country = params.country || user.country;
        user.email = params.email || user.email;
        user.birth = params.birth || user.birth;
        user.gender = params.gender || user.gender;

        if (params.imageId) {
            user.profile.imageId = params.imageId;
        }

        await this.userRepo.save(user);
        return {
            message: 'Profile is updated successfully!'
        }
    }

    async updateProfiles(params: updateProfileAdminDto, userId: number) {
        let user = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['profile']
        });

        if (!user) throw new NotFoundException('User is not found!');

        if (params.email) {
            const existingUser = await this.userRepo.findOne({
                where: { email: params.email }
            });

            if (existingUser && existingUser.id !== userId) {
                throw new ConflictException('Email already exists');
            }
        }

        if (user.role === UserRole.ARTIST) throw new BadRequestException('This user is already artist!')

        if (params.role === UserRole.ARTIST) {
            let artist = this.artistEntity.create({
                userId: user.id
            })
            await artist.save()
        }

        user.fullname = params.fullname || user.fullname;
        user.country = params.country || user.country;
        user.email = params.email || user.email;
        user.birth = params.birth || user.birth;
        user.gender = params.gender || user.gender;
        user.role = params.role || user.role

        if (user.profile && params.imageId) {
            await this.profileRepo.update(
                { id: user.profile.id },
                { imageId: params.imageId }
            );
        }

        await this.userRepo.save(user);

        return {
            message: 'Profile is updated successfully!'
        }
    }

    async updateProfile(params: UpdateProfileDto, id: number) {

        let user = this.userRepo.findOne({ where: { id } })

        if (!user) throw new NotFoundException("User is not found")

        await this.profileRepo.update({ userId: id }, params)

        return {
            message: 'Profile is updated successfully!'
        }
    }

    async deleteProfile(id: number) {

        let user = await this.userRepo.findOne({ where: { id } })

        if (!user) throw new NotFoundException("User is not found with given id!")

        await this.userRepo.delete({ id })

        return {
            messagge: "User is deleted successfully!"
        }

    }
}