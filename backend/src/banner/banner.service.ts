import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // ✅ `Types` import kiya
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
    // ✅ Convert string zone IDs to ObjectId
    let zoneObjectIds: Types.ObjectId[];
    try {
      zoneObjectIds = zoneIds.map(id => new Types.ObjectId(id));
    } catch (error) {
      throw new Error('Invalid zone ID format. Must be valid MongoDB ObjectId.');
    }

    const bannerQuery: any = {
      zone_id: { $in: zoneObjectIds }, // ✅ Now compares ObjectId
      is_active: true,
    };

    if (featured !== undefined && ['1', 'true'].includes(featured)) {
      bannerQuery.featured = true;
    }

    if (currentModule) {
      bannerQuery.module_id = currentModule.id;
    }

    const banners = await this.bannerModel.find(bannerQuery).lean();

    return {
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
    if (cached) {
      return cached;
    }

    // ✅ Convert string zone IDs to ObjectId
    let zoneObjectIds: Types.ObjectId[];
    try {
      zoneObjectIds = zoneIds.map(id => new Types.ObjectId(id));
    } catch (error) {
      throw new Error('Invalid zone ID format. Must be valid MongoDB ObjectId.');
    }

    const bannerQuery: any = {
      zone_id: { $in: zoneObjectIds }, // ✅ ObjectId
      data: storeId,
      created_by: 'store',
      is_active: true,
    };

    if (currentModule) {
      bannerQuery.module_id = currentModule.id;
    }

    const banners = await this.bannerModel.find(bannerQuery).lean();
    await this.cacheManager.set(cacheKey, banners, 20 * 60 * 1000); // 20 minutes
    return banners;
  }
}