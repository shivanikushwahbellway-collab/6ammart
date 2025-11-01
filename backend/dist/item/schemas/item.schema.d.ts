import { Document, Types } from 'mongoose';
export declare class Item {
    module_id: Types.ObjectId;
}
export declare const ItemSchema: import("mongoose").Schema<Item, import("mongoose").Model<Item, any, any, any, Document<unknown, any, Item, any, {}> & Item & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Item, Document<unknown, {}, import("mongoose").FlatRecord<Item>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Item> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type ItemDocument = Item & Document;
