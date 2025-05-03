import { Module } from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlaylistEntity } from 'src/entities/playlist.entity';
import { SongsEntity } from 'src/entities/songs.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PlaylistEntity, SongsEntity])],
    controllers: [PlaylistController],
    providers: [PlaylistService],
})
export class PlaylistModule { };