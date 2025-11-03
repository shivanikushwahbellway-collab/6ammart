export declare class Guest {
    ip_address?: string;
    fcm_token?: string;
}
export declare const GuestSchema: import("mongoose").Schema<Guest, import("mongoose").Model<Guest, any, any, any, import("mongoose").Document<unknown, any, Guest, any, {}> & Guest & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Guest, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Guest>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Guest> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
