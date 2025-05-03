import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { AuthService } from './auth.service';
import { LoginAuthDto, LoginWithFirebaseDto } from './dto/login-auth.dto';
import { Auth } from 'src/shares/decorators/auth.decorator';
import { ClsService } from 'nestjs-cls';
import { UserEntity } from 'src/entities/user.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private clsSerivce: ClsService
    ) { }

    @Get('verify')
    @Auth()
    @HttpCode(HttpStatus.OK)
    verifyToken() {
        return this.authService.verifyToken()
    }

    @Post('register')
    async register(@Body() body: RegisterAuthDto) {
        return await this.authService.register(body)
    }

    @Post('login')
    async login(@Body() body: LoginAuthDto) {
        return await this.authService.login(body)
    }

    @Post('reset-password')
    @Auth()
    async resetPassword(@Body() body: ResetPasswordDto) {
        return await this.authService.resetPassword(body)
    }


    @Post('firebase')
    async loginWithFirebase(@Body() body: LoginWithFirebaseDto) {
        let result = await this.authService.loginWithFirebase(body);
        return result
        // res.cookie('authorization', result.token, {
        //     sameSite: 'none',
        //     httpOnly: true,
        //     secure: true,
        // });
        // res.json(result);
    }

}