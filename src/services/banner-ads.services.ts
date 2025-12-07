import { Env } from "@/config/Env";

const { NEXT_PUBLIC_API_URL } = Env

export interface GetBannerAdsProps {
    title: string;
    productUrl: string;
    bannerAdsId: number;
    productImageUrl: string;
}
class BannerAdsService {
    async getBannerAdsRandom({
        revalidate,
        cache,
    }: {
        revalidate?: number;
        cache?: RequestCache;
    }): Promise<any> {
        try {
            const bannerAdsRes = await fetch(
                `${NEXT_PUBLIC_API_URL}/api/banners-ads/random`,
                {
                    method: "GET",
                    cache: cache,
                    next: {
                        revalidate: revalidate,
                    },
                }
            );
            const banner = await bannerAdsRes.json();
            return banner;
        } catch (error) {
            return {
                success: false,
                message: "Error",
                error: error,
            };
        }
    }
}

const bannerAdsService = new BannerAdsService();

export default bannerAdsService;
