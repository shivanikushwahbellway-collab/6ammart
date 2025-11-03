// store.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type StoreDocument = Store & Document;

@Schema({ timestamps: true, collection: 'stores' })
export class Store {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Module', required: true })
  module_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Zone', required: true })
  zone_id: Types.ObjectId;

  @Prop({ default: true })
  status: boolean; // active = true

  @Prop()
  address?: string;

  @Prop()
  phone?: string;

  @Prop()
  image?: string;

  @Prop({ type: Number, default: 0 })
  rating?: number;

  // Agar store ke paas apni koi special settings hain, toh add karo
  // Lekin "store_ids" ❌ definitely nahi!
}

export const StoreSchema = SchemaFactory.createForClass(Store);

// Optional: Index for performance
StoreSchema.index({ module_id: 1, zone_id: 1, status: 1 });