import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Auth } from 'src/shares/decorators/auth.decorator';
import { UpdatePremiumSubscriptionDto } from './dto/update-subscription.dto';
import { PremiumSubscriptionService } from './premium.service';
import { UserRole } from 'src/shares/enums/role.enum';

@Controller('premium-subscription')
export class PremiumController {
    constructor(
        private subscriptionService: PremiumSubscriptionService
    ) { }


    @Get()
    @Auth()
    async getPremiumSubscription() {
        return await this.subscriptionService.getPremiumSubscription()
    }

    @Post('me')
    @Auth()
    async upgradePremium(@Body() body: UpdatePremiumSubscriptionDto) {
        return await this.subscriptionService.upgradePremium(body)
    }
    
    @Delete()
    @Auth()
    async deleteSubscription() {
        return await this.subscriptionService.deleteSubscription()
    }
    
    @Post(':id')
    @Auth(UserRole.Admin)
    async updateSubscriptionAll(@Body() body: UpdatePremiumSubscriptionDto, @Param('id') id: number) {
        return await this.subscriptionService.updateSubscriptionAll(body, id)
    }
    
    @Delete(':id')
    @Auth(UserRole.Admin)
    async deleteSubscriptionAll(@Param('id') id: number) {
        return await this.subscriptionService.deleteSubscriptionAll(id)
    }
}