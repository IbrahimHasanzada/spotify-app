import { Controller, Post, Delete, Param, Get, UseGuards, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { FollowService } from './follow.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Auth } from 'src/shares/decorators/auth.decorator';

@ApiTags('follows')
@Controller('follows')
export class FollowController {
    constructor(private readonly followService: FollowService) { }

    @Post('artist/:artistId')
    @Auth()
    @ApiOperation({ summary: 'Follow an artist' })
    async followArtist(
        @Param('artistId') artistId: number
    ) {
        return await this.followService.followArtist(artistId);
    }

    @Delete('artist/:artistId')
    @ApiOperation({ summary: 'Unfollow an artist' })
    @Auth()
    async unfollowArtist(
        @Param('artistId') artistId: number
    ) {
        return await this.followService.unfollowArtist(artistId);
    }

    @Get('artist/:artistId/followers')
    @ApiOperation({ summary: 'Get all followers of an artist' })
    async getArtistFollowers(@Param('artistId') artistId: number) {
        return await this.followService.getArtistFollowers(artistId);
    }

    @Get('user/:userId/following')
    @ApiOperation({ summary: 'Get all artists a user is following' })
    async getUserFollowing(@Param('userId') userId: number) {
        return await this.followService.getUserFollowing(userId);
    }

    @Get('status/user/:userId/artist/:artistId')
    @ApiOperation({ summary: 'Check if a user follows a specific artist' })
    async checkFollowStatus(
        @Param('userId') userId: number,
        @Param('artistId') artistId: number
    ): Promise<{ follows: boolean }> {
        const follows = await this.followService.checkFollowStatus(artistId, userId);
        return { follows };
    }

    @Get('me/status/artist/:artistId')
    @ApiOperation({ summary: 'Check if current user follows a specific artist' })
    @Auth()
    async checkCurrentUserFollowStatus(
        @Param('artistId') artistId: number,
        // @Param('userId') userId: number,
    ) {
        const follows = await this.followService.checkFollowStatus(artistId);
        return { follows };
    }




}