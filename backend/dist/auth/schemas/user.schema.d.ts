import { HydratedDocument, Types } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export declare class User {
    f_name: string;
    l_name?: string;
    image?: string;
    phone?: string;
    email?: string;
    password?: string;
    login_medium?: string;
    social_id?: string;
    temp_token?: string;
    remember_token?: string;
    otp?: string;
    reset_token?: string;
    reset_token_expires_at?: Date;
    otp_expires_at?: Date;
    is_phone_verified: boolean;
    is_email_verified: boolean;
    interest?: string;
    current_language_key: string;
    cm_firebase_token?: string;
    status: boolean;
    order_count: number;
    wallet_balance: number;
    loyalty_point: number;
    ref_code?: string;
    ref_by?: Types.ObjectId;
    zone_id?: Types.ObjectId;
    module_ids?: string;
    is_from_pos: boolean;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User, any, {}> & User & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
