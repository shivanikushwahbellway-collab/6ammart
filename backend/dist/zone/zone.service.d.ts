import { Model } from 'mongoose';
import { Zone } from './schemas/zone.schema';
export declare class ZoneService {
    private zoneModel;
    constructor(zoneModel: Model<Zone>);
    getZones(): Promise<any[]>;
    zonesCheck(lat: number, lng: number, zoneId: string): Promise<boolean>;
}
