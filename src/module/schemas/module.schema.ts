import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModuleDocument = Module & Document;

@Schema({ timestamps: true })
export class Module {
  @Prop({ required: true })
  module_name: string;

  @Prop({ required: true })
  module_type: string; // e.g., 'food', 'grocery', 'parcel'

  @Prop()
  thumbnail?: string;

  @Prop({ default: true })
  status: boolean; // active = true

  @Prop({ default: 0 })
  stores_count: number;

  @Prop()
  icon?: string;

  @Prop({ default: 1 })
  theme_id: number;

  @Prop()
  description?: string;

  @Prop({ default: false })
  all_zone_service: boolean;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);