import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// ✅ Use HydratedDocument for better typing
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true })
  f_name: string;

  @Prop()
  l_name?: string;

  @Prop({ unique: true, sparse: true })
  phone?: string;

  @Prop({ unique: true, sparse: true })
  email?: string;

  @Prop()
  image?: string;

  @Prop({ default: false })
  is_phone_verified: boolean;

  @Prop({ default: false })
  is_email_verified: boolean;

  @Prop()
  password?: string;

  @Prop()
  remember_token?: string;

  @Prop()
  interest?: string;

  @Prop()
  cm_firebase_token?: string;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: 0 })
  order_count: number;

  @Prop()
  login_medium?: string;

  @Prop()
  social_id?: string;

  // ✅ ObjectId reference (optional)
  @Prop({ type: Types.ObjectId, ref: 'Zone' })
  zone_id?: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  wallet_balance: number;

  @Prop({ type: Number, default: 0 })
  loyalty_point: number;

  @Prop({ unique: true, sparse: true })
  ref_code?: string;

  @Prop({ default: 'en' })
  current_language_key: string;

  // ✅ ObjectId reference (optional)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  ref_by?: Types.ObjectId;

  @Prop()
  temp_token?: string;

  @Prop()
  module_ids?: string;

  @Prop({ default: false })
  is_from_pos: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// ✅ Indexes (like MySQL)
// UserSchema.index({ phone: 1 });
// UserSchema.index({ ref_code: 1 });
UserSchema.index({ zone_id: 1 });