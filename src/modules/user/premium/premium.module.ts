import { Module } from '@nestjs/common';
import { PremiumController } from './premium.controller';
import { PremiumSubscriptionService } from './premium.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PremiumEntity } from 'src/entities/premium.entity';
import { ProfileEntity } from 'src/entities/profile.entity';
import { UserEntity } from 'src/entities/user.entity';
import { UserService } from '../user.service';
import { ArtistEntity } from 'src/entities/artist.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PremiumEntity, ProfileEntity, UserEntity, ArtistEntity])],
    controllers: [PremiumController],
    providers: [PremiumSubscriptionService, UserService],
})
export class PremiumModule { };