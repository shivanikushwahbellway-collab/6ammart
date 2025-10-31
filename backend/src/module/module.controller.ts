import {
  Controller,
  Get,
  Req,
  Query,
  BadRequestException,
  UseInterceptors,
  ClassSerializerInterceptor,
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
    if (req.headers['zoneid']) {
      const raw = req.headers['zoneid'];
      try {
        const parsed = JSON.parse(raw as string);
        zoneIds = Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
      } catch (e) {
        throw new BadRequestException('Invalid zoneId header format. Expected JSON array or string.');
      }
    }
    // Case 2: zone_id in query param
    else if (queryZoneId) {
      fallbackZoneId = String(queryZoneId);
      zoneIds = [fallbackZoneId];
    }
    // Case 3: no zone → return all (but Laravel code still filters stores by zone_id if present)
    // We'll pass empty zoneIds and let service handle

    const modules = await this.moduleService.findAllForZones(zoneIds, fallbackZoneId);

    return modules;
  }
}