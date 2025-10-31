import {
  Controller,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ZoneService } from './zone.service';

@Controller('zone')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Get('list')
  async getZones() {
    return this.zoneService.getZones();
  }

  @Get('check')
  async zonesCheck(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('zone_id') zoneId: string,
  ) {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      throw new BadRequestException('lat and lng must be valid numbers');
    }

    const result = await this.zoneService.zonesCheck(latNum, lngNum, zoneId);
    return result;
  }
}