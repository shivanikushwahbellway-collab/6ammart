import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEnum(['manual', 'otp', 'social'])
  login_type: 'manual' | 'otp' | 'social';

  // Manual
  @IsOptional()
  email_or_phone?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  otp?: string;

  @IsOptional()
  verified?: boolean;

  // Social
  @IsOptional()
  token?: string;

  @IsOptional()
  unique_id?: string;

  @IsOptional()
  medium?: 'google' | 'facebook' | 'apple';

  @IsOptional()
  guest_id?: string;
}
