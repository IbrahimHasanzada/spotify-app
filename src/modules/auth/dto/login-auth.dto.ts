import { Type } from "class-transformer"
import { IsAlphanumeric, IsEmail, IsJWT, IsString, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class LoginAuthDto {
    @Type()
    @IsEmail()
    @ApiProperty({ default: 'test@example.com' })
    email: string

    @Type()
    @IsAlphanumeric()
    @MinLength(10)
    @ApiProperty({ default: 'john123456' })
    password: string


}

export class LoginWithFirebaseDto {
    @Type()
    @IsString()
    @IsJWT()
    @ApiProperty({ required: true })
    token: string
}

export interface FirebaseUser {
    name: string;
    picture: string;
    iss: string;
    aud: string;
    auth_time: number;
    user_id: string;
    sub: string;
    iat: number;
    exp: number;
    email: string;
    email_verified: boolean;
    firebase: FirebaseInfo;
    uid: string;
}

export interface FirebaseInfo {
    identities: Identities;
    sign_in_provider: string;
}

export interface Identities {
    "google.com": string[];
    "email": string[];
}