import { ProfileEntity } from 'src/entities/profile.entity';
import { SongsEntity } from 'src/entities/songs.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, BaseEntity, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class PlaylistEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ default: false })
    isPublic: boolean;

    @Column()
    userId: number

    @ManyToOne(() => UserEntity, user => user.playlists)
    owner: UserEntity;
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'id'
    })

    @ManyToMany(() => SongsEntity)
    @JoinTable()
    songs: SongsEntity[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}