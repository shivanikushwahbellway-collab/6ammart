import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
export declare class SocialauthController {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    googleLogin(email: string, name: string, image?: string): Promise<{
        success: boolean;
        user: {
            id: import("mongoose").Types.ObjectId;
            email: string | undefined;
            name: string;
            image: string | undefined;
        };
    }>;
}
