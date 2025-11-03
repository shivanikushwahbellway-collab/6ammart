import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from '../auth/schemas/user.schema';
import { PhoneVerification } from '../auth/schemas/phone-verification.schema';
import { EmailVerification } from '../auth/schemas/email-verification.schema';
import { Guest } from '../auth/schemas/guest.schema';
export declare class AuthService {
    private userModel;
    private phoneVerificationModel;
    private emailVerificationModel;
    private guestModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, phoneVerificationModel: Model<PhoneVerification>, emailVerificationModel: Model<EmailVerification>, guestModel: Model<Guest>, jwtService: JwtService);
    private generateToken;
    private generateOtp;
    private generateRefCode;
    private assignRefCode;
    private mergeGuestCart;
    register(dto: any): Promise<{
        status: boolean;
        message: string;
        data: {
            token: string | null;
            is_phone_verified: number;
            is_email_verified: boolean;
            is_personal_info: number;
            is_exist_user: null;
            login_type: string;
            email: string | null;
        };
    } | {
        status: boolean;
        message: any;
        data: {
            token?: undefined;
            is_phone_verified?: undefined;
            is_email_verified?: undefined;
            is_personal_info?: undefined;
            is_exist_user?: undefined;
            login_type?: undefined;
            email?: undefined;
        };
    }>;
    login(dto: any): Promise<{
        status: boolean;
        message: string;
        data: {
            token: string | null;
            is_phone_verified: number;
            is_email_verified: number;
            is_personal_info: number;
            is_exist_user: null;
            login_type: string;
            email: string | null;
        };
    } | {
        status: boolean;
        message: any;
        data: {
            token?: undefined;
            is_phone_verified?: undefined;
            is_email_verified?: undefined;
            is_personal_info?: undefined;
            is_exist_user?: undefined;
            login_type?: undefined;
            email?: undefined;
        };
    }>;
    manualLogin(dto: any): Promise<{
        status: boolean;
        message: string;
        data: {
            token: string | null;
            is_phone_verified: number;
            is_email_verified: number;
            is_personal_info: number;
            is_exist_user: null;
            login_type: string;
            email: string | null;
        };
    } | {
        status: boolean;
        message: any;
        data: {
            token?: undefined;
            is_phone_verified?: undefined;
            is_email_verified?: undefined;
            is_personal_info?: undefined;
            is_exist_user?: undefined;
            login_type?: undefined;
            email?: undefined;
        };
    }>;
    sendOtp(dto: any): Promise<{
        status: boolean;
        message: string;
        data: {
            token: null;
            is_phone_verified: number;
            is_email_verified: number;
            is_personal_info: number;
            is_exist_user: null;
            login_type: string;
            email: null;
        };
    } | {
        status: boolean;
        message: any;
        data: {
            token?: undefined;
            is_phone_verified?: undefined;
            is_email_verified?: undefined;
            is_personal_info?: undefined;
            is_exist_user?: undefined;
            login_type?: undefined;
            email?: undefined;
        };
    }>;
    otpLogin(dto: any): Promise<{
        status: boolean;
        message: string;
        data: {
            token: string | null;
            is_phone_verified: number;
            is_email_verified: number;
            is_personal_info: number;
            is_exist_user: null;
            login_type: string;
            email: string | null;
        };
    } | {
        status: boolean;
        message: any;
        data: {
            token?: undefined;
            is_phone_verified?: undefined;
            is_email_verified?: undefined;
            is_personal_info?: undefined;
            is_exist_user?: undefined;
            login_type?: undefined;
            email?: undefined;
        };
    }>;
    socialLogin(dto: any): Promise<{
        status: boolean;
        message: string;
        data: {
            token: string | null;
            is_phone_verified: number;
            is_email_verified: number;
            is_personal_info: number;
            is_exist_user: null;
            login_type: string;
            email: string | null;
        };
    } | {
        status: boolean;
        message: any;
        data: {
            token?: undefined;
            is_phone_verified?: undefined;
            is_email_verified?: undefined;
            is_personal_info?: undefined;
            is_exist_user?: undefined;
            login_type?: undefined;
            email?: undefined;
        };
    }>;
    verifyPhoneOrEmail(dto: any): Promise<{
        status: boolean;
        message: string;
        data: {
            token: string | null;
            is_phone_verified: number;
            is_email_verified: number;
            is_personal_info: number;
            is_exist_user: null;
            login_type: any;
            email: string | null;
        };
    } | {
        status: boolean;
        message: any;
        data: {
            token?: undefined;
            is_phone_verified?: undefined;
            is_email_verified?: undefined;
            is_personal_info?: undefined;
            is_exist_user?: undefined;
            login_type?: undefined;
            email?: undefined;
        };
    }>;
    firebaseAuthVerify(dto: any): Promise<{
        status: boolean;
        message: string;
        data: {
            token: string | null;
            is_phone_verified: number;
            is_email_verified: number;
            is_personal_info: number;
            is_exist_user: null;
            login_type: any;
            email: string | null;
        };
    } | {
        status: boolean;
        message: any;
        data: {
            token?: undefined;
            is_phone_verified?: undefined;
            is_email_verified?: undefined;
            is_personal_info?: undefined;
            is_exist_user?: undefined;
            login_type?: undefined;
            email?: undefined;
        };
    }>;
    guestRequest(dto: any): Promise<{
        status: boolean;
        message: string;
        data: {
            guest_id: string;
        };
    } | {
        status: boolean;
        message: any;
        data: {
            guest_id?: undefined;
        };
    }>;
    updateInfo(dto: any): Promise<{
        status: boolean;
        message: string;
        data: {
            token: string;
            is_phone_verified: number;
            is_email_verified: number;
            is_personal_info: number;
            is_exist_user: null;
            login_type: any;
            email: any;
        };
    } | {
        status: boolean;
        message: any;
        data: {
            token?: undefined;
            is_phone_verified?: undefined;
            is_email_verified?: undefined;
            is_personal_info?: undefined;
            is_exist_user?: undefined;
            login_type?: undefined;
            email?: undefined;
        };
    }>;
    customerLoginFromDrivemond(dto: any): Promise<{
        status: boolean;
        message: string;
        data: {
            token: string;
            is_phone_verified: boolean;
        };
    } | {
        status: boolean;
        message: any;
        data: {
            token?: undefined;
            is_phone_verified?: undefined;
        };
    }>;
}
