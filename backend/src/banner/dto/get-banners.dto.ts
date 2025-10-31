import { IsOptional, IsString } from 'class-validator';

export class GetBannersDto {
  @IsOptional()
  @IsString()
  featured?: string;
}
