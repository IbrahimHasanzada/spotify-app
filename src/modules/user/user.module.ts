import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from 'src/entities/profile.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UserService } from './user.service';
import { ArtistEntity } from 'src/entities/artist.entity';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([ProfileEntity, UserEntity, ArtistEntity])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { };