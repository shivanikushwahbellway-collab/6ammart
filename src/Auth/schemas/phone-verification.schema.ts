import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PhoneVerificationDocument = HydratedDocument<PhoneVerification>;

@Schema({ timestamps: true, collection: 'phone_verifications' })
export class PhoneVerification {
  @Prop({ required: true, unique: true, index: true })
  phone: string;

  @Prop({ required: true })
  token: string;

  @Prop({ default: 0 })
  otp_hit_count: number;

  @Prop({ default: false })
  is_blocked: boolean;

  @Prop({ default: false })
  is_temp_blocked: boolean;

  @Prop()
  temp_block_time?: Date;

  // ✅ Optional: Explicitly define for TypeScript safety (inside class)
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const PhoneVerificationSchema = SchemaFactory.createForClass(PhoneVerification);