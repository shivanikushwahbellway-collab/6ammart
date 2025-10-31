import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module, ModuleDocument } from './schemas/module.schema';
import { StoreDocument } from '../store/schemas/store.schema';
import { ItemDocument } from '../item/schemas/item.schema';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name) private moduleModel: Model<ModuleDocument>,
    @InjectModel('Store') private storeModel: Model<StoreDocument>,
    @InjectModel('Item') private itemModel: Model<ItemDocument>,
  ) {}

  async findAllForZones(zoneIds: string[], fallbackZoneId?: string) {
    // Step 1: Get active, non-parcel modules that are linked to given zones
    // In MongoDB, we don't have direct "whereHas" → so we assume module-zone link is managed via business logic
    // For now, we'll assume ALL modules are available in all zones unless restricted (simplified)
    // If you have `module_zones` collection, replace this with a lookup

    const query: any = { status: true };

    // Exclude parcel modules if zone_id is provided (mimics ->notParcel())
    if (fallbackZoneId) {
      query.module_type = { $ne: 'parcel' };
    }

    const modules = await this.moduleModel.find(query).lean().exec();

    // Step 2: Attach counts
    const modulesWithCounts = await Promise.all(
      modules.map(async (mod) => {
        const moduleId = mod._id.toString();

        // Count items
        const items_count = await this.itemModel.countDocuments({ module_id: moduleId });

        // Count stores
        let stores_count = 0;
        if (zoneIds && zoneIds.length > 0) {
          stores_count = await this.storeModel.countDocuments({
            module_id: moduleId,
            zone_id: { $in: zoneIds.map(id => id) },
          });
        } else if (fallbackZoneId) {
          stores_count = await this.storeModel.countDocuments({
            module_id: moduleId,
            zone_id: fallbackZoneId,
          });
        } else {
          stores_count = await this.storeModel.countDocuments({ module_id: moduleId });
        }

        return {
          ...mod,
          items_count,
          stores_count,
        };
      }),
    );

    return modulesWithCounts;
  }
}