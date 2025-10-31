import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Zone } from './schemas/zone.schema';

@Injectable()
export class ZoneService {
  constructor(
    @InjectModel('Zone') private zoneModel: Model<Zone>,
  ) {}

  async getZones() {
    const zones = await this.zoneModel.find({ status: true }).lean().exec();

    return zones.map((zone: any) => {
      const coords = zone.coordinates?.coordinates?.[0] || [];
      const formatted = coords.map(([lng, lat]: [number, number]) => ({ lat, lng }));
      return {
        ...zone,
        formated_coordinates: formatted,
      };
    });
  }

  async zonesCheck(lat: number, lng: number, zoneId: string) {
    if (!lat || !lng || !zoneId) {
      throw new BadRequestException('lat, lng, and zone_id are required');
    }

    const exists = await this.zoneModel.exists({
      _id: zoneId,
      status: true,
      coordinates: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
        },
      },
    });

    return !!exists;
  }
}