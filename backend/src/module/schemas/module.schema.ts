import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModuleDocument = Module & Document;

@Schema({ timestamps: true })
export class Module {
  @Prop({ required: true })
  module_name: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: false })
  all_zone_service: boolean;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
