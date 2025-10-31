import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Item {
  @Prop({ type: Types.ObjectId, ref: 'Module', required: true })
  module_id: Types.ObjectId;

  // ... other fields
}

export const ItemSchema = SchemaFactory.createForClass(Item);
export type ItemDocument = Item & Document;