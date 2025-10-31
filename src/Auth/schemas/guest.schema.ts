
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'guests' })
export class Guest {
  @Prop()
  ip_address?: string;

  @Prop()
  fcm_token?: string;
}

export const GuestSchema = SchemaFactory.createForClass(Guest);