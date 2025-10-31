import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'email_verifications' })
export class EmailVerification {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  token: string; // OTP
}

export type EmailVerificationDocument = EmailVerification & Document;

export const EmailVerificationSchema = SchemaFactory.createForClass(EmailVerification);

