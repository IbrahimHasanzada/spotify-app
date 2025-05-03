import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PremiumEntity } from 'src/entities/premium.entity';
import { ProfileEntity } from 'src/entities/profile.entity';
import { Repository } from 'typeorm';
import { UpdatePremiumSubscriptionDto } from './dto/update-subscription.dto';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from 'src/entities/user.entity';
import { subscriptionFeatures } from 'src/shares/utils/subscriptionFeatures.util';

@Injectable()
export class PremiumSubscriptionService {
    constructor(
        @InjectRepository(ProfileEntity)
        private readonly profileRepo: Repository<ProfileEntity>,
        @InjectRepository(PremiumEntity)
        private premiumRepo: Repository<PremiumEntity>,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        private cls: ClsService
    ) { }

    async getPremiumSubscription() {
        let user = this.cls.get<UserEntity>('user')
        let profile = await this.profileRepo.findOne({ where: { userId: user.id } })
        let subscription = await this.premiumRepo.findOne({ where: { profileId: profile?.id } })

        return subscription
    }

    async upgradePremium(params: UpdatePremiumSubscriptionDto) {
        let user = this.cls.get<UserEntity>('user')

        let profile = await this.profileRepo.findOne({ where: { userId: user.id } })

        let subscriptionFeature = subscriptionFeatures(params)

        let subscription

        if (profile?.subscriptionId) {
            subscription = await this.premiumRepo.update(
                { id: profile.subscriptionId },
                {
                    ...subscriptionFeature,
                    profileId: profile?.id,
                }
            )
        } else {
            subscription = this.premiumRepo.create({
                ...subscriptionFeature,
                profileId: profile?.id,
            })
            await subscription.save()
        }


        if (profile) {
            profile.subscriptionId = subscription.id
            await profile.save()
        }

        return { message: "Profile successfully subscripted!" }
    }


    async deleteSubscription() {
        let user = this.cls.get('user')
        let id = user.profile.premiumSubscription?.id

        await this.premiumRepo.delete({ id })

        return { message: "Profile successfully unsubscribed!" }
    }

    async deleteSubscriptionAll(userId: number) {
        let user = await this.userRepo.findOne({ where: { id: userId }, relations: ['profile'] })

        if (!user) throw new NotFoundException('User is not found!')

        let id = user.profile.subscriptionId

        await this.premiumRepo.delete({ id })

        return { message: "Profile successfully unsubscribed!" }
    }

    async updateSubscriptionAll(params: UpdatePremiumSubscriptionDto, id: number) {

        let user = await this.userRepo.findOne({ where: { id } })

        if (!user) throw new NotFoundException('User is not found!')

        let profile = await this.profileRepo.findOne({ where: { userId: user.id } })

        let subscriptionFeature = subscriptionFeatures(params)

        let subscription: any

        if (profile?.subscriptionId) {
            subscription = await this.premiumRepo.update(
                { id: profile.subscriptionId },
                {
                    ...subscriptionFeature,
                    profileId: profile?.id,
                }
            )
        } else {
            subscription = this.premiumRepo.create({
                ...subscriptionFeature,
                profileId: profile?.id,
            })
            await subscription.save()
        }


        if (profile) {
            profile.subscriptionId = subscription.id
            await profile.save()
        }

        return { message: "Profile successfully subscripted!" }
    }


}
