import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Banner, BannerDocument } from './schemas/banner.schema';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getBanners(
    zoneIds: string[],
    featured?: string,
    currentModule?: { id: string; all_zone_service: boolean },
  ) {
    const bannerQuery: any = {
      zone_id: { $in: zoneIds }, // ✅ Direct string match
      is_active: true,
    };

    // Support both ?featured=1 and ?featured=true
    if (['1', 'true'].includes(featured)) {
      bannerQuery.featured = true;
    }

    if (currentModule) {
      bannerQuery.module_id = currentModule.id;
    }

    const banners = await this.bannerModel.find(bannerQuery).lean();

    return {
      // campaigns: [], // removed as per your setup
      banners,
    };
  }

  async getStoreBanners(
    zoneIds: string[],
    storeId: string,
    currentModule?: { id: string; all_zone_service: boolean },
  ) {
    const cacheKey = `banners_store_${zoneIds.join('_')}_${storeId}_${currentModule?.id || 'default'}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const bannerQuery: any = {
      zone_id: { $in: zoneIds }, // ✅ string
      data: storeId,             // assuming data = store_id (string)
      created_by: 'store',
      is_active: true,
    };

    if (currentModule) {
      bannerQuery.module_id = currentModule.id;
    }

    const banners = await this.bannerModel.find(bannerQuery).lean();
    await this.cacheManager.set(cacheKey, banners, 20 * 60 * 1000); // 20 mins
    return banners;
  }
}