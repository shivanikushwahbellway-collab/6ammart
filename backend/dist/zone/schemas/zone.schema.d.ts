import { Document } from 'mongoose';
export interface ZoneDocument extends Document {
    formated_coordinates?: {
        lat: number;
        lng: number;
    }[];
}
export declare class Zone {
    name: string;
    display_name?: string;
    coordinates: {
        type: 'Polygon';
        coordinates: number[][][];
    };
    status: boolean;
    store_wise_topic?: string;
    customer_wise_topic?: string;
    deliveryman_wise_topic?: string;
    cash_on_delivery: boolean;
    digital_payment: boolean;
    offline_payment: boolean;
    increased_delivery_fee: number;
    increased_delivery_fee_status: boolean;
    increase_delivery_charge_message?: string;
}
export declare const ZoneSchema: import("mongoose").Schema<Zone, import("mongoose").Model<Zone, any, any, any, Document<unknown, any, Zone, any, {}> & Zone & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Zone, Document<unknown, {}, import("mongoose").FlatRecord<Zone>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Zone> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
