import { Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import { BannerDocument } from './schemas/banner.schema';
export declare class BannerService {
    private bannerModel;
    private cacheManager;
    constructor(bannerModel: Model<BannerDocument>, cacheManager: Cache);
    getBanners(zoneIds: string[], featured?: string, currentModule?: {
        id: string;
        all_zone_service: boolean;
    }): Promise<{
        banners: (import("mongoose").FlattenMaps<BannerDocument> & Required<{
            _id: import("mongoose").FlattenMaps<unknown>;
        }> & {
            __v: number;
        })[];
    }>;
    getStoreBanners(zoneIds: string[], storeId: string, currentModule?: {
        id: string;
        all_zone_service: boolean;
    }): Promise<{}>;
}
