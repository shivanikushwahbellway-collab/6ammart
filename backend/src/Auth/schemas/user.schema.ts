// src/user/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// Use HydratedDocument for better typing

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  // Basic Information
  @Prop({ required: true })
  f_name: string;

  @Prop()
  l_name?: string;

  @Prop()
  image?: string;

  // Contact Information
  @Prop({ unique: true, sparse: true })
  phone?: string;

  @Prop({ unique: true, sparse: true })
  email?: string;

  // Authentication
  @Prop()
  password?: string;

  @Prop({ enum: ['google', 'facebook', 'apple', 'manual'] })
  login_medium?: string;

  @Prop()
  social_id?: string;

  @Prop()
  temp_token?: string;

  @Prop()
  remember_token?: string;

  // Verification Status
  @Prop({ default: false })
  is_phone_verified: boolean;

  @Prop({ default: false })
  is_email_verified: boolean;

  // User Preferences
  @Prop()
  interest?: string;

  @Prop({ default: 'en' })
  current_language_key: string;

  // Push Notifications
  @Prop()
  cm_firebase_token?: string;

  // User Status
  @Prop({ default: true })
  status: boolean;

  // Order History
  @Prop({ default: 0 })
  order_count: number;

  // Wallet & Loyalty
  @Prop({ type: Number, default: 0 })
  wallet_balance: number;

  @Prop({ type: Number, default: 0 })
  loyalty_point: number;

  // Referral System
  @Prop({ unique: true, sparse: true })
  ref_code?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  ref_by?: Types.ObjectId;

  // Location
  @Prop({ type: Types.ObjectId, ref: 'Zone' })
  zone_id?: Types.ObjectId;

  // Additional Fields
  @Prop()
  module_ids?: string;

  @Prop({ default: false })
  is_from_pos: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for better query performance
UserSchema.index({ phone: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ ref_code: 1 });
UserSchema.index({ zone_id: 1 });
UserSchema.index({ status: 1 });
