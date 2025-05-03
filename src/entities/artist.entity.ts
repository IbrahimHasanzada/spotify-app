import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { AlbumEntity } from "./album.entity";
import { SongsEntity } from "./songs.entity";

@Entity('artist')

export class ArtistEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true, type: 'text' })
    bio: string;

    @Column({ default: 0 })
    followCount: number;

    @ManyToMany(() => UserEntity, user => user.followingArtists)
    followers: UserEntity[];

    @OneToMany(() => AlbumEntity, (album) => album.artist)
    albums: AlbumEntity[];

    @Column()
    userId: number

    @ManyToMany(() => SongsEntity, (songs) => songs.artist, { onDelete: 'CASCADE' })
    songs: SongsEntity[]

    @OneToOne(() => UserEntity, user => user.artist, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'userId',
        referencedColumnName: 'id'
    })
    user: UserEntity;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date
}