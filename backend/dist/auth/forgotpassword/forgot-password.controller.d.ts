import { Model } from 'mongoose';
import { UserDocument } from '../schemas/user.schema';
export declare class ForgotPasswordController {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    forgotPassword(phone: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyOtp(phone: string, otp: string): Promise<{
        success: boolean;
        message: string;
        reset_token: string;
    }>;
    resetPassword(resetToken: string, newPassword: string, confirmPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
