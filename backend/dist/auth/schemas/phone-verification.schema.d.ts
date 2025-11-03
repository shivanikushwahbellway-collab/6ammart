import { HydratedDocument } from 'mongoose';
export type PhoneVerificationDocument = HydratedDocument<PhoneVerification>;
export declare class PhoneVerification {
    phone: string;
    token: string;
    otp_hit_count: number;
    is_blocked: boolean;
    is_temp_blocked: boolean;
    temp_block_time?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const PhoneVerificationSchema: import("mongoose").Schema<PhoneVerification, import("mongoose").Model<PhoneVerification, any, any, any, import("mongoose").Document<unknown, any, PhoneVerification, any, {}> & PhoneVerification & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PhoneVerification, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<PhoneVerification>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<PhoneVerification> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
