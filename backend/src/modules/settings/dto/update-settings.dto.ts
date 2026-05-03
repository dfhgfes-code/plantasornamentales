import { IsString, IsOptional, IsBooleanString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shop_phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shop_email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shop_address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shop_whatsapp?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shop_instagram?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shop_facebook?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  home_hero_carousel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  home_promo_marquee?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBooleanString()
  home_holiday_banner_enabled?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  home_holiday_banner_text?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  home_holiday_banner_link?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBooleanString()
  popup_enabled?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  popup_title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  popup_subtitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  popup_discount_label?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  popup_cta_text?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  popup_cta_link?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBooleanString()
  maintenance_mode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  maintenance_title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  maintenance_subtitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  maintenance_eta?: string;
}
