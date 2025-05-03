import { PremiumEnum } from "src/shares/enums/premium.enum";
import { UpdatePremiumSubscriptionDto } from "src/modules/user/premium/dto/update-subscription.dto";
import { PremiumSubscriptionFeaturesDto } from "src/modules/user/premium/dto/subscription-features.dto";

export function subscriptionFeatures(features: UpdatePremiumSubscriptionDto): PremiumSubscriptionFeaturesDto {
    const { type } = features;

    const defaultFeatures: Omit<PremiumSubscriptionFeaturesDto, 'type'> = {
        price: 0,
        maxUsers: 1,
        adFree: false,
        offlineMode: false,
        highQualityAudio: false,
        requiresStudentVerification: false
    };

    switch (type) {
        case PremiumEnum.INDIVIDUAL:
            return { type, ...defaultFeatures, price: 4.99, adFree: true, offlineMode: true, highQualityAudio: true };

        case PremiumEnum.DUO:
            return { type, ...defaultFeatures, price: 6.49, maxUsers: 2, adFree: true, offlineMode: true, highQualityAudio: true };

        case PremiumEnum.FAMILY:
            return { type, ...defaultFeatures, price: 7.99, maxUsers: 6, adFree: true, offlineMode: true, highQualityAudio: true };

        case PremiumEnum.STUDENT:
            return { type, ...defaultFeatures, price: 2.49, requiresStudentVerification: true, adFree: true };

        default:
            return { type, ...defaultFeatures };
    }
}
