import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true }) // optional: createdAt/updatedAt
export class Banner {
  @Prop({ type: String, required: true }) // ✅ Explicitly string
  zone_id: string;

  @Prop({ type: String })
  module_id: string;

  @Prop({ type: Boolean, default: true })
  is_active: boolean;

  @Prop({ type: Boolean, default: false })
  featured: boolean;

  @Prop({ type: String, required: true }) // e.g., store_id or JSON string
   string;

  @Prop({ type: String, required: true })
  created_by: string;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);