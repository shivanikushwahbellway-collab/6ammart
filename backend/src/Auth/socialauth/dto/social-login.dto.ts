import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class SocialRegisterDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  unique_id: string;

  @ValidateIf(o => ['google', 'facebook'].includes(o.medium))
  @IsString()
  email?: string;

  @IsOptional()
  phone: string;

  @IsEnum(['google', 'facebook', 'apple'])
  medium: string;

  @IsOptional()
  ref_code?: string;

  @IsOptional()
  id_token?: boolean;
}
