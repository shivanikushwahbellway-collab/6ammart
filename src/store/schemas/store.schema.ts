import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Store {
  @Prop({ type: Types.ObjectId, ref: 'Module', required: true })
  module_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Zone', required: true })
  zone_id: Types.ObjectId;

  // ... other fields
}
export const StoreSchema = SchemaFactory.createForClass(Store);
export type StoreDocument = Store & Document;
