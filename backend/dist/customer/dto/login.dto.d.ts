export declare class LoginDto {
    login_type: 'manual' | 'otp' | 'social';
    email_or_phone?: string;
    password?: string;
    phone?: string;
    otp?: string;
    verified?: boolean;
    token?: string;
    unique_id?: string;
    medium?: 'google' | 'facebook' | 'apple';
    guest_id?: string;
}
