import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumEntity } from 'src/entities/album.entity';
import { UserService } from 'src/modules/user/user.service';
import { UserEntity } from 'src/entities/user.entity';
import { ProfileEntity } from 'src/entities/profile.entity';
import { ArtistEntity } from 'src/entities/artist.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AlbumEntity, UserEntity, ProfileEntity, ArtistEntity])],
    controllers: [AlbumController],
    providers: [AlbumService, UserService],
})
export class AlbumModule { };