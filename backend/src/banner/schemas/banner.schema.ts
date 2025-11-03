import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; // ✅ Types import kiya

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true })
export class Banner {
  @Prop({ type: Types.ObjectId, ref: 'Zone', required: true }) // ✅ ObjectId + reference
  zone_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Module' })
  module_id: Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  is_active: boolean;

  @Prop({ type: Boolean, default: false })
  featured: boolean;

  @Prop({ type: String, required: true }) // e.g., store_id or JSON string
  data: string;

  @Prop({ type: String, required: true })
  created_by: string;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);