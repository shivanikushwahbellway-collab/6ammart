import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { PhoneVerification, PhoneVerificationSchema } from '../auth/schemas/phone-verification.schema';
import { EmailVerification, EmailVerificationSchema } from '../auth/schemas/email-verification.schema';
import { Guest, GuestSchema } from '../auth/schemas/guest.schema';
@Module({
  imports: [
    // ✅ Add JwtModule here
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'sindbad-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: PhoneVerification.name, schema: PhoneVerificationSchema },
      { name: EmailVerification.name, schema: EmailVerificationSchema },
      { name: Guest.name, schema: GuestSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: PhoneVerification.name, schema: PhoneVerificationSchema },
      { name: EmailVerification.name, schema: EmailVerificationSchema },
      { name: Guest.name, schema: GuestSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
