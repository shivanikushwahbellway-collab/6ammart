import { Model } from 'mongoose';
import { DataSettingDocument } from './schemas/data-setting.schema';
export declare class HomeService {
    private dataSettingModel;
    constructor(dataSettingModel: Model<DataSettingDocument>);
    getSetting(key: string): Promise<string>;
    getSettingsByType(type: string): Promise<Record<string, string>>;
}
