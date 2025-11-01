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
      throw new BadRequestException({
        status: false,
        message: 'Zone ID is required',
      });
    }

    let zoneIds: string[];
    try {
      zoneIds = JSON.parse(zoneIdHeader);
    } catch (e) {
      throw new BadRequestException({
        status: false,
        message: 'Invalid zoneId header format. Expected JSON array.',
      });
    }

    const currentModule = moduleId
      ? {
          id: moduleId,
          all_zone_service: allZoneServiceStr === 'true',
        }
      : undefined;

    const { banners } = await this.bannerService.getBanners(zoneIds, dto.featured, currentModule);

    return {
      status: true,
      message: 'Banners fetched successfully',
       banners,
    };
  }

  @Get('/store/:store_id')
  async getStoreBanners(
    @Headers('zoneId') zoneIdHeader: string,
    @Param('store_id') storeId: string,
    @Headers('x-module-id') moduleId?: string,
    @Headers('x-all-zone-service') allZoneServiceStr?: string,
  ) {
    if (!zoneIdHeader) {
      throw new BadRequestException({
        status: false,
        message: 'Zone ID is required',
      });
    }

    let zoneIds: string[];
    try {
      zoneIds = JSON.parse(zoneIdHeader);
    } catch (e) {
      throw new BadRequestException({
        status: false,
        message: 'Invalid zoneId header format. Expected JSON array.',
      });
    }

    const currentModule = moduleId
      ? {
          id: moduleId,
          all_zone_service: allZoneServiceStr === 'true',
        }
      : undefined;

    const banners = await this.bannerService.getStoreBanners(zoneIds, storeId, currentModule);

    return {
      status: true,
      message: 'Store banners fetched successfully',
       banners,
    };
  }
}