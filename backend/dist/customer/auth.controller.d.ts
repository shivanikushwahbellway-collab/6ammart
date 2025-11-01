import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GuestRequestDto } from './dto/guest-request.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
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
    login(dto: LoginDto): Promise<{
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
    guestRequest(dto: GuestRequestDto): Promise<{
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
}
