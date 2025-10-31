import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'email_verifications' })
export class EmailVerification {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  token: string; // OTP
}

export const EmailVerificationSchema = SchemaFactory.createForClass(EmailVerification);