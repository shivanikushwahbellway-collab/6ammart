import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export interface ZoneDocument extends Document {
  formated_coordinates?: { lat: number; lng: number }[];
}

@Schema({ timestamps: true, collection: 'zones' })
export class Zone {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  display_name?: string;

  // GeoJSON Polygon for MongoDB geospatial queries
  @Prop({
    required: true,
    type: Object,
    default: {
      type: 'Polygon',
      coordinates: [],
    },
  })
  coordinates: {
    type: 'Polygon';
    coordinates: number[][][]; // [ [ [lng, lat], ... ] ]
  };

  @Prop({ default: true })
  status: boolean;

  // Notification topics
  @Prop({ trim: true })
  store_wise_topic?: string;

  @Prop({ trim: true })
  customer_wise_topic?: string;

  @Prop({ trim: true })
  deliveryman_wise_topic?: string;

  // Payment settings
  @Prop({ default: true })
  cash_on_delivery: boolean;

  @Prop({ default: true })
  digital_payment: boolean;

  @Prop({ default: false })
  offline_payment: boolean;

  @Prop({ type: Number, default: 0 })
  increased_delivery_fee: number;

  @Prop({ default: false })
  increased_delivery_fee_status: boolean;

  @Prop()
  increase_delivery_charge_message?: string;
}

export const ZoneSchema = SchemaFactory.createForClass(Zone);
ZoneSchema.index({ coordinates: '2dsphere' }); // ⚡ Essential for geospatial queries