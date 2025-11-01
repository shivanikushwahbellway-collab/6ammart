import { ZoneService } from './zone.service';
export declare class ZoneController {
    private readonly zoneService;
    constructor(zoneService: ZoneService);
    getZones(): Promise<any[]>;
    zonesCheck(lat: string, lng: string, zoneId: string): Promise<boolean>;
}
