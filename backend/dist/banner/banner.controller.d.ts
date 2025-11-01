import { BannerService } from './banner.service';
import { GetBannersDto } from './dto/get-banners.dto';
export declare class BannerController {
    private bannerService;
    constructor(bannerService: BannerService);
    getBanners(zoneIdHeader: string, dto: GetBannersDto, moduleId?: string, allZoneServiceStr?: string): Promise<{
        status: boolean;
        message: string;
        banners: (import("mongoose").FlattenMaps<import("./schemas/banner.schema").BannerDocument> & Required<{
            _id: import("mongoose").FlattenMaps<unknown>;
        }> & {
            __v: number;
        })[];
    }>;
    getStoreBanners(zoneIdHeader: string, storeId: string, moduleId?: string, allZoneServiceStr?: string): Promise<{
        status: boolean;
        message: string;
        banners: {};
    }>;
}
