import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Banner, BannerDocument } from './schemas/banner.schema';
import { ZoneDocument } from '../zone/schemas/zone.schema';
import { ModuleDocument } from '../module/schemas/module.schema';
import { StoreDocument } from '../store/schemas/store.schema';

@Injectable()
export class BannerService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
    @InjectModel('Zone') private zoneModel: Model<ZoneDocument>,
    @InjectModel('Module') private moduleModel: Model<ModuleDocument>,
    @InjectModel('Store') private storeModel: Model<StoreDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getBanners(
    zoneIds: string[],
    featured?: string,
    currentModule?: { id: string; all_zone_service: boolean },
  ) {
    const bannerQuery: any = {
      zone_id: { $in: zoneIds },
      is_active: true,
    };
    if (featured === '1') {
      bannerQuery.featured = true;
    }
    if (currentModule) {
      bannerQuery.module_id = currentModule.id;
    }
    const banners = await this.bannerModel.find(bannerQuery).lean();

    // ✅ Campaign logic completely removed
    return {
      campaigns: [], // empty array (or remove this field if not needed)
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

    let bannerQuery = this.bannerModel
      .find({
        zone_id: { $in: zoneIds },
        data: storeId,
        created_by: 'store',
        is_active: true,
      })
      .lean();

    if (currentModule) {
      bannerQuery = bannerQuery.where('module_id').equals(currentModule.id);
    }

    const banners = await bannerQuery.exec();
    await this.cacheManager.set(cacheKey, banners, 20 * 60 * 1000);
    return banners;
  }
}