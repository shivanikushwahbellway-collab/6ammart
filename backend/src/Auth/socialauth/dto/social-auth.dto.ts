import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class SocialAuthDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  unique_id: string;

  @ValidateIf(o => ['google', 'facebook'].includes(o.medium))
  @IsString()
  email?: string;

  @IsNotEmpty()
  phone: string;

  @IsEnum(['google', 'facebook', 'apple'])
  medium: string;

  @IsOptional()
  ref_code?: string;

  @IsOptional()
  id_token?: boolean;
}
