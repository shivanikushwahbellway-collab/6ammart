import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from '../schemas/user.schema';
import { PhoneVerification, PhoneVerificationSchema } from '../schemas/phone-verification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: PhoneVerification.name, schema: PhoneVerificationSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class SocialauthModule {} 