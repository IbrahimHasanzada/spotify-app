import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { ImageEntity } from "./image.entity";
import { PremiumEntity } from "./premium.entity";

@Entity("profile")
export class ProfileEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    userId: number

    @Column({ nullable: true })
    subscriptionId: number

    @Column({ nullable: true })
    imageId: string

    @ManyToOne(() => PremiumEntity, (premium) => premium.profiles, { nullable: true, cascade: false, onDelete: 'SET NULL' })
    @JoinColumn({
        name: 'subscriptionId',
        referencedColumnName: 'id'
    })
    premiumSubscription?: PremiumEntity;

    @OneToOne(() => ImageEntity)
    @JoinColumn({
        name: 'imageId',
        referencedColumnName: 'id'
    })
    image: ImageEntity

    @OneToOne(() => UserEntity, (user) => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'id'
    })
    user: UserEntity

    @CreateDateColumn()
    createdAt: Date
}