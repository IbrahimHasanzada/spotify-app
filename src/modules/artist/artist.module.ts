import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { ArtistEntity } from 'src/entities/artist.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { AlbumEntity } from 'src/entities/album.entity';
import { SongsEntity } from 'src/entities/songs.entity';
import { FollowController } from './follow/follow.controller';
import { FollowService } from './follow/follow.service';

@Module({
    imports: [TypeOrmModule.forFeature([ArtistEntity, UserEntity, AlbumEntity, SongsEntity])],
    controllers: [ArtistController, FollowController],
    providers: [ArtistService, FollowService],
})
export class ArtistModule { };