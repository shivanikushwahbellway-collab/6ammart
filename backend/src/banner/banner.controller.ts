import {
  Controller,
  Get,
  Headers,
  Query,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { BannerService } from './banner.service';
import { GetBannersDto } from './dto/get-banners.dto';

@Controller('banner')
export class BannerController {
  constructor(private bannerService: BannerService) {}

  @Get('/list')
  async getBanners(
    @Headers('zoneId') zoneIdHeader: string,
    @Query() dto: GetBannersDto,
    @Headers('x-module-id') moduleId?: string,
    @Headers('x-all-zone-service') allZoneServiceStr?: string,
  ) {
    if (!zoneIdHeader) {
      throw new BadRequestException([
        { code: 'zoneId', message: 'Zone ID is required' },
      ]);
    }

    const zoneIds = JSON.parse(zoneIdHeader);
    const currentModule = moduleId
      ? {
          id: moduleId,
          all_zone_service: allZoneServiceStr === 'true',
        }
      : null;

    return this.bannerService.getBanners(zoneIds, dto.featured, currentModule ?? undefined);
  }

  @Get('/store/:store_id')
  async getStoreBanners(
    @Headers('zoneId') zoneIdHeader: string,
    @Param('store_id') storeId: string,
    @Headers('x-module-id') moduleId?: string,
    @Headers('x-all-zone-service') allZoneServiceStr?: string,
  ) {
    if (!zoneIdHeader) {
      throw new BadRequestException([
        { code: 'zoneId', message: 'Zone ID is required' },
      ]);
    }

    const zoneIds = JSON.parse(zoneIdHeader);
    const currentModule = moduleId
      ? {
          id: moduleId,
          all_zone_service: allZoneServiceStr === 'true',
        }
      : null;

      return this.bannerService.getStoreBanners(zoneIds, storeId, currentModule ?? undefined);
  }
}
