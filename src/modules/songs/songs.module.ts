import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsEntity } from 'src/entities/songs.entity';
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service';
import { UserService } from '../user/user.service';
import { UserEntity } from 'src/entities/user.entity';
import { ProfileEntity } from 'src/entities/profile.entity';
import { ArtistEntity } from 'src/entities/artist.entity';
import { AlbumEntity } from 'src/entities/album.entity';
    
@Module({
    imports: [TypeOrmModule.forFeature([SongsEntity, AlbumEntity, UserEntity, ProfileEntity, ArtistEntity])],
    controllers: [SongsController],
    providers: [SongsService, CloudinaryService, UserService],
})
export class SongsModule { };