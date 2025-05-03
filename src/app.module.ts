import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import database from './config/database';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import config from './config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'path';
import { ClsModule } from 'nestjs-cls';
import { Request } from 'express';
import { FirebaseModule } from './libs/firebase/firebase.module';
import { UserModule } from './modules/user/user.module';
import { UploadModule } from './modules/upload/upload.module';
import { PremiumModule } from './modules/user/premium/premium.module';
import { SongsModule } from './modules/songs/songs.module';
import { ArtistModule } from './modules/artist/artist.module';
import { AlbumModule } from './modules/artist/album/album.module';
import { PlaylistModule } from './modules/playlist/playlist.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(database.options),
    JwtModule.register({
      global: true,
      secret: config.jwtSecret,
      signOptions: { expiresIn: '1d' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        setup: (cls, req: Request) => {
          cls.set('ip', req.ip);
        },
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    FirebaseModule,
    UserModule,
    UploadModule,
    PremiumModule,
    SongsModule,
    ArtistModule,
    AlbumModule,
    PlaylistModule
  ],
  providers: [AppService],
})
export class AppModule { }
