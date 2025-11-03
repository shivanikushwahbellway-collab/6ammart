import { Document } from 'mongoose';
export declare class EmailVerification {
    email: string;
    token: string;
}
export type EmailVerificationDocument = EmailVerification & Document;
export declare const EmailVerificationSchema: import("mongoose").Schema<EmailVerification, import("mongoose").Model<EmailVerification, any, any, any, Document<unknown, any, EmailVerification, any, {}> & EmailVerification & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EmailVerification, Document<unknown, {}, import("mongoose").FlatRecord<EmailVerification>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<EmailVerification> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
