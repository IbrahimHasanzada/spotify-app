import { UserGender } from "src/shares/enums/gender.enum";
import { UserRole } from "src/shares/enums/role.enum";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt'
import { UserProvider } from "src/shares/enums/user.enum";
import { ProfileEntity } from "./profile.entity";
import { ArtistEntity } from "./artist.entity";
import { PlaylistEntity } from "./playlist.entity";

@Entity("user")
export class UserEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    fullname: string

    @Column({ nullable: true, unique: true })
    email: string

    @Column({ type: 'enum', enum: UserGender, default: UserGender.Male, nullable: true })
    gender: UserGender

    @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
    role: UserRole

    @Column({ nullable: true })
    birth: Date

    @Column()
    password: string

    @Column({ nullable: true })
    country: string

    @Column({ type: 'enum', enum: UserProvider, default: UserProvider.LOCAL })
    provider: UserProvider;

    @Column({ nullable: true })
    providerId: string;

    @OneToOne(() => ProfileEntity, (profile) => profile.user, { cascade: true })
    profile: ProfileEntity

    @OneToMany(() => PlaylistEntity, playlist => playlist.owner)
    playlists: PlaylistEntity[];


    @ManyToMany(() => ArtistEntity, artist => artist.followers)
    @JoinTable({
        name: 'user_artist_follows',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'artist_id',
            referencedColumnName: 'id'
        }
    })
    followingArtists: ArtistEntity[];

    @OneToOne(() => ArtistEntity, artist => artist.user, { nullable: true })
    artist: ArtistEntity;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date

    // @BeforeInsert()
    // @BeforeUpdate()
    // async beforeUpsert() {
    //     if (!this.password) return
    //     this.password = await bcrypt.hash(this.password, 10)

    // }
}