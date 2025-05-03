import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { AuthUtils } from './auth.utils';
import { FirebaseModule } from 'src/libs/firebase/firebase.module';
import { ImageEntity } from 'src/entities/image.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, ImageEntity]), FirebaseModule],
    controllers: [AuthController],
    providers: [AuthService, AuthUtils],
})
export class AuthModule { };