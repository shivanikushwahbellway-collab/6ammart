import {
  Controller,
  Get,
  Req,
  Query,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ModuleService } from './module.service';

@Controller('modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @Get()
  async index(@Req() req: Request, @Query('zone_id') queryZoneId?: string) {
    let zoneIds: string[] = [];
    let fallbackZoneId: string | undefined = undefined;

    // Case 1: zoneId in header (JSON array string)
    if (req.headers['zoneId']) {
      const raw = req.headers['zoneId'];
      try {
        const parsed = JSON.parse(raw as string);
        zoneIds = Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
      } catch (e) {
        throw new BadRequestException({
          status: false,
          message: 'Invalid zoneId header format. Expected JSON array or string.',
          data: null,
        });
      }
    }
    // Case 2: zone_id in query param
    else if (queryZoneId) {
      fallbackZoneId = String(queryZoneId);
      zoneIds = [fallbackZoneId];
    }

    const modules = await this.moduleService.findAllForZones(zoneIds, fallbackZoneId);

    return {
      status: true,
      message: 'Modules fetched successfully',
      data: modules,
    };
  }
}