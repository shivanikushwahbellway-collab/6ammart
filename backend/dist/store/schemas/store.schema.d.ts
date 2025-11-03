import { Document, Types } from 'mongoose';
export declare class Store {
    module_id: Types.ObjectId;
    zone_id: Types.ObjectId;
    store_ids: Types.ObjectId[];
}
export declare const StoreSchema: import("mongoose").Schema<Store, import("mongoose").Model<Store, any, any, any, Document<unknown, any, Store, any, {}> & Store & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Store, Document<unknown, {}, import("mongoose").FlatRecord<Store>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Store> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type StoreDocument = Store & Document;
