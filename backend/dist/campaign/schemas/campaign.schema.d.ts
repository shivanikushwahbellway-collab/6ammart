import { Document, Types } from 'mongoose';
export declare class Campaign {
    title: string;
    image: string;
    module_id: Types.ObjectId;
    store_ids: Types.ObjectId[];
    is_active: boolean;
    is_running: boolean;
}
export declare const CampaignSchema: import("mongoose").Schema<Campaign, import("mongoose").Model<Campaign, any, any, any, Document<unknown, any, Campaign, any, {}> & Campaign & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Campaign, Document<unknown, {}, import("mongoose").FlatRecord<Campaign>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Campaign> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export type CampaignDocument = Campaign & Document;
