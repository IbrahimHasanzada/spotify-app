import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { updateProfileAdminDto, UpdateProfileDto } from './dto/update-profile.dto';
import { Auth } from 'src/shares/decorators/auth.decorator';
import { UserRole } from 'src/shares/enums/role.enum';

@Controller('users')
export class UserController {
    constructor(
        private userService: UserService
    ) { }
    
    @Get('profile/all')
    @Auth()
    async getAllProfile() {
        return await this.userService.getAllProfile()
    }
    @Get('profile/:id')
    async getProfile(@Param('id') id: number) {
        return await this.userService.getProfile(id)
    }

    @Get('profile')
    @Auth()
    async getMyProfile() {
        return await this.userService.getMyProfile()
    }


    @Post('profile')
    @Auth()
    async updateMyProfile(@Body() body: UpdateProfileDto) {
        return await this.userService.updateMyProfile(body)
    }

    @Post('profile/:id')
    @Auth(UserRole.Admin)
    async updateProfiles(@Body() body: updateProfileAdminDto, @Param('id') id: number) {
        return await this.userService.updateProfiles(body, id)
    }


    @Delete('profile/:id')
    async deleteProfile(@Param('id') id: number) {
        return await this.userService.deleteProfile(id)
    }

}