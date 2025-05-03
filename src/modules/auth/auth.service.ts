import { BadRequestException, ConflictException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { ConnectionCheckOutStartedEvent, FindOptionsWhere, Repository } from 'typeorm';
import { LoginAuthDto, LoginWithFirebaseDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { UserProvider } from 'src/shares/enums/user.enum';
import { FirebaseService } from 'src/libs/firebase/firebase.service';
import { AuthUtils } from './auth.utils';
import { ImageEntity } from 'src/entities/image.entity';
import { ClsService } from 'nestjs-cls';
import { ResetPasswordDto } from './dto/reset-password.dto';
@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private cls: ClsService,
        private firebaseService: FirebaseService,
        private authUtils: AuthUtils,
        @InjectRepository(UserEntity)
        private userRepo: Repository<UserEntity>,
        @InjectRepository(ImageEntity)
        private imageRepo: Repository<ImageEntity>
    ) { }


    verifyToken() {
        let user = this.cls.get<UserEntity>('user')
        return {
            statusCode: HttpStatus.OK,
            message: 'Token is valid',
            user: {
                role: user.role,
                email: user.email,
                image: user.profile.imageId,
                fullname: user.fullname
            },
        }
    }

    async register(params: RegisterAuthDto) {

        let checkUser = await this.userRepo.findOne({ where: { email: params.email } })

        if (checkUser) throw new ConflictException({ message: "Email is already exsist" })

        params.password = await bcrypt.hash(params.password, 10)

        let user = this.userRepo.create({
            fullname: params.fullname,
            email: params.email,
            birth: params.birth,
            country: params.country,
            gender: params.gender,
            password: params.password,
            profile: {}
        })

        await user.save()

        return {
            ...user,
            profile: undefined
        }

    }

    async login(params: LoginAuthDto) {

        let user = await this.userRepo.findOne({ where: { email: params.email } })

        if (!user) throw new NotFoundException("Email or password is wrong!")

        let checkPassword = await bcrypt.compare(params.password, user.password)

        console.log(checkPassword)
        if (!checkPassword) throw new NotFoundException("Email or password is wrong!");

        let token = this.authUtils.generateToken(user.id)

        return {
            user: {
                ...user,
                password: undefined
            },
            token
        }

    }


    async resetPassword(param: ResetPasswordDto) {
        const user = this.cls.get<UserEntity>('user');

        const checkUser = await this.userRepo.findOne({
            where: { id: user.id },
            select: ['id', 'password'],
        });

        if (!checkUser || !checkUser.password) throw new UnauthorizedException('User not found or password not available')

        if (param.newPassword === param.previousPassword) throw new BadRequestException('New password must be different from the previous password')

        const isPasswordValid = await bcrypt.compare(param.previousPassword, checkUser.password);

        if (!isPasswordValid) throw new UnauthorizedException('Previous password is incorrect')

        const hashedNewPassword = await bcrypt.hash(param.newPassword, 10);

        await this.userRepo.update(user.id, { password: hashedNewPassword });
        
        return { message: "Password updated successfully" }
    }


    async loginWithFirebase(params: LoginWithFirebaseDto) {
        let admin = this.firebaseService.firebaseApp;
        let firebaseResult = await admin.auth().verifyIdToken(params.token);
        console.log(firebaseResult)
        if (!firebaseResult?.uid)
            throw new InternalServerErrorException('Something went wrong');

        let uid = firebaseResult.uid;
        let email = firebaseResult.email;

        let where: FindOptionsWhere<UserEntity>[] = [
            {
                providerId: uid,
                provider: UserProvider.FIREBASE,
            },
        ];

        if (email) {
            where.push({
                email,
            });
        }

        let user = await this.userRepo.findOne({
            where,
        });


        if (!user) {

            let image = firebaseResult.picture
                ? await this.imageRepo.save({
                    url: firebaseResult.picture,
                })
                : undefined;

            user = this.userRepo.create({
                fullname: firebaseResult.name,
                email,
                password: crypto.randomUUID(),
                provider: UserProvider.FIREBASE,
                providerId: uid,
                profile: {
                    imageId: image?.id,
                }
            });

            await user.save();
        }

        let token = this.authUtils.generateToken(user.id)
        return {
            user,
            token,
        };
    }
}
