import { BaseEntity, Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProfileEntity } from "./profile.entity";
import { PremiumEnum } from "src/shares/enums/premium.enum";

@Entity('premium_subscriptions')
export class PremiumEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: PremiumEnum, default: PremiumEnum.FREE })
    type: PremiumEnum;

    @Column()
    profileId: number

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    price: number;

    @Column({ type: 'int', default: 1 })
    maxUsers: number;

    @Column({ type: 'boolean', default: false })
    adFree: boolean;

    @Column({ type: 'boolean', default: false })
    offlineMode: boolean;

    @Column({ type: 'boolean', default: false })
    highQualityAudio: boolean;

    @Column({ type: 'boolean', default: false })
    requiresStudentVerification: boolean;

    @OneToMany(() => ProfileEntity, (profile) => profile.premiumSubscription)
    @JoinColumn({
        name: 'profileId',
        referencedColumnName: 'id'
    })
    profiles: ProfileEntity[];
}