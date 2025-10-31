import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema()
export class Banner {
  @Prop()
  zone_id: string;

  @Prop()
  module_id: string;

  @Prop()
  is_active: boolean;

  @Prop()
  featured: boolean;

  @Prop()
  data: string;

  @Prop()
  created_by: string;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
