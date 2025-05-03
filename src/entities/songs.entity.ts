import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AlbumEntity } from "./album.entity";
import { ArtistEntity } from "./artist.entity";
import { PlaylistEntity } from "./playlist.entity";

@Entity('songs')

export class SongsEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    audioUrl: string;

    @Column()
    title: string

    @Column({ default: 0, nullable: true })
    playCount: number;

    @Column()
    albumId: number

    @Column()
    artistId: number

    @Column()
    genre: string

    @ManyToMany(() => ArtistEntity, (artist) => artist.songs)
    @JoinColumn({
        name: 'artistId',
        referencedColumnName: 'id'
    })
    artist: ArtistEntity

    @ManyToOne(() => AlbumEntity, (album) => album.songs, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'albumId',
        referencedColumnName: 'id'
    })
    album: AlbumEntity;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date
}