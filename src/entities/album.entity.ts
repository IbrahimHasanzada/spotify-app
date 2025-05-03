import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ArtistEntity } from "./artist.entity";
import { SongsEntity } from "./songs.entity";

@Entity('albums')
export class AlbumEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'date', nullable: true })
    releaseDate: Date;

    @Column()
    artistId: number

    @ManyToOne(() => ArtistEntity, artist => artist.albums, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'artistId',
        referencedColumnName: 'id'
    })
    artist: ArtistEntity;

    @OneToMany(() => SongsEntity, (songs) => songs.album)
    songs: SongsEntity[];

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date
}