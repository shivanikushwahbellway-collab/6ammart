import { Document } from 'mongoose';
export type DataSettingDocument = DataSetting & Document;
export declare class DataSetting {
    key: string;
    value: string;
    type: string;
}
export declare const DataSettingSchema: import("mongoose").Schema<DataSetting, import("mongoose").Model<DataSetting, any, any, any, Document<unknown, any, DataSetting, any, {}> & DataSetting & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, DataSetting, Document<unknown, {}, import("mongoose").FlatRecord<DataSetting>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<DataSetting> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
