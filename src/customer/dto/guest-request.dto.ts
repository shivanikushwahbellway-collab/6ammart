// src/modules/auth/dto/guest-request.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class GuestRequestDto {
  @IsOptional()
  @IsString()
  ip_address?: string;

  @IsOptional()
  @IsString()
  fcm_token?: string;
}