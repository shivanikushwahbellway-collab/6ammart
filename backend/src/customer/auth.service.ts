import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // ✅ Types import karo
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../Auth/schemas/user.schema';
import { PhoneVerification } from '../Auth/schemas/phone-verification.schema';
import { EmailVerification } from '../Auth/schemas/email-verification.schema';
import { Guest } from '../Auth/schemas/guest.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(PhoneVerification.name)
    private phoneVerificationModel: Model<PhoneVerification>,
    @InjectModel(EmailVerification.name)
    private emailVerificationModel: Model<EmailVerification>,
    @InjectModel(Guest.name) private guestModel: Model<Guest>,
    private jwtService: JwtService,
  ) {}

  private generateToken(user: UserDocument): string {
    const payload = { email: user.email, sub: user._id.toString() };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  private generateOtp(): string {
    return process.env.APP_MODE === 'test' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateRefCode(user: UserDocument): string {
    return (user._id.toString().substring(0, 6) + Math.random().toString(36).substring(2, 8)).toUpperCase();
  }

  private async assignRefCode(user: UserDocument): Promise<void> {
    if (!user.ref_code) {
      const refCode = this.generateRefCode(user);
      await this.userModel.updateOne({ _id: user._id }, { ref_code: refCode });
    }
  }

  private async mergeGuestCart(userId: string, guestId: string): Promise<void> {
    console.log(`Merging guest cart ${guestId} into user ${userId}`);
  }

  // ✅ Register
  async register(dto: any) {
    const { name, email, phone, password, ref_code, guest_id } = dto;
    const [firstName, lastName = ''] = name.split(' ', 2);

    let refBy: Types.ObjectId | null = null; // ✅ Types.ObjectId
    if (ref_code) {
      const refUser = await this.userModel.findOne({ ref_code, status: true });
      if (!refUser) {
        throw new BadRequestException('Referrer code not found');
      }
      refBy = refUser._id;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      f_name: firstName,
      l_name: lastName,
      email,
      phone,
      password: hashedPassword,
      ref_by: refBy,
    });
    await user.save();
    await this.assignRefCode(user);

    let isPhoneVerified = 1;
    let isEmailVerified = 1;

    const phoneVerificationEnabled = true;
    if (phoneVerificationEnabled) {
      isPhoneVerified = 0;
      const otp = this.generateOtp();
      await this.phoneVerificationModel.updateOne(
        { phone },
        { token: otp, otp_hit_count: 0 },
        { upsert: true },
      );
    }

    const token = isPhoneVerified && isEmailVerified ? this.generateToken(user) : null;
    return {
      token,
      is_phone_verified: isPhoneVerified,
      is_email_verified: isEmailVerified,
      is_personal_info: 1,
      is_exist_user: null,
      login_type: 'manual',
      email: user.email || null,
    };
  }

  // 🔑 Login
  async login(dto: any) {
    const { login_type } = dto;
    if (login_type === 'manual') return this.manualLogin(dto);
    if (login_type === 'otp') return dto.verified ? this.otpLogin(dto) : this.sendOtp(dto);
    if (login_type === 'social') return this.socialLogin(dto);
    throw new BadRequestException('Invalid login type');
  }

  // 🔐 Manual Login
  async manualLogin(dto: any) {
    const { email_or_phone, password, field_type, guest_id } = dto;
    const query = field_type === 'email' ? { email: email_or_phone } : { phone: email_or_phone };
    const user = await this.userModel.findOne(query);
    if (!user) throw new UnauthorizedException('User not found');

    // ✅ Fix: user.password may be undefined
    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

    if (!user.status) throw new UnauthorizedException('Account blocked');

    await this.assignRefCode(user);
    user.login_medium = 'manual';
    await user.save();

    const token = user.f_name ? this.generateToken(user) : null;
    if (guest_id && token) {
      await this.mergeGuestCart(user._id.toString(), guest_id);
    }

    return {
      token,
      is_phone_verified: 1,
      is_email_verified: 1,
      is_personal_info: user.f_name ? 1 : 0,
      is_exist_user: null,
      login_type: 'manual',
      email: user.email || null,
    };
  }

  // 📲 Send OTP
async sendOtp(dto: any) {
  const { phone } = dto;
  const otpInterval = 60; // seconds

  const existing = await this.phoneVerificationModel.findOne({ phone });

  // ✅ Check if existing and updatedAt exists
  if (
    existing &&
    existing.updatedAt && // ✅ Add this check
    Date.now() - new Date(existing.updatedAt).getTime() < otpInterval * 1000
  ) {
    const timeLeft = otpInterval - Math.floor((Date.now() - new Date(existing.updatedAt).getTime()) / 1000);
    throw new BadRequestException(`Please try again after ${timeLeft} seconds`);
  }

  const otp = this.generateOtp();
  await this.phoneVerificationModel.updateOne(
    { phone },
    { token: otp, otp_hit_count: 0 },
    { upsert: true },
  );

  return {
    token: null,
    is_phone_verified: 0,
    is_email_verified: 1,
    is_personal_info: 1,
    is_exist_user: null,
    login_type: 'otp',
    email: null,
  };
}

  // ✅ OTP Login
  async otpLogin(dto: any) {
    const { phone, otp, guest_id } = dto;
    const verification = await this.phoneVerificationModel.findOne({ phone, token: otp });
    if (!verification) throw new BadRequestException('OTP does not match');

    let user = await this.userModel.findOne({ phone });
    if (!user) {
      const hashedPassword = await bcrypt.hash(phone, 10);
      user = new this.userModel({
        phone,
        password: hashedPassword,
        is_phone_verified: true, // ✅ boolean
        login_medium: 'otp',
      });
      await user.save();
      await this.assignRefCode(user);
    } else {
      if (!user.status) throw new UnauthorizedException('Account blocked');
      user.is_phone_verified = true; // ✅ boolean
      user.login_medium = 'otp';
      await user.save();
      await this.assignRefCode(user);
    }

    await this.phoneVerificationModel.deleteOne({ phone, token: otp });

    const token = user.f_name ? this.generateToken(user) : null;
    if (guest_id && token) {
      await this.mergeGuestCart(user._id.toString(), guest_id);
    }

    return {
      token,
      is_phone_verified: 1,
      is_email_verified: 1,
      is_personal_info: user.f_name ? 1 : 0,
      is_exist_user: null,
      login_type: 'otp',
      email: user.email || null,
    };
  }

  // 🌐 Social Login
  async socialLogin(dto: any) {
    const { email, medium, unique_id, guest_id } = dto;
    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = new this.userModel({
        email,
        login_medium: medium,
        temp_token: unique_id,
        is_email_verified: true, // ✅ boolean
      });
      await user.save();
      await this.assignRefCode(user);
    } else {
      if (!user.status) throw new UnauthorizedException('Account blocked');
      user.login_medium = medium;
      user.is_email_verified = true; // ✅ boolean
      await user.save();
      await this.assignRefCode(user);
    }

    const token = user.f_name ? this.generateToken(user) : null;
    if (guest_id && token) {
      await this.mergeGuestCart(user._id.toString(), guest_id);
    }

    return {
      token,
      is_phone_verified: 1,
      is_email_verified: 1,
      is_personal_info: user.f_name ? 1 : 0,
      is_exist_user: null,
      login_type: 'social',
      email: user.email || null,
    };
  }

  // ✅ Verify OTP
  async verifyPhoneOrEmail(dto: any) {
    const { otp, verification_type, phone, email, login_type, guest_id } = dto;
    const user = phone
      ? await this.userModel.findOne({ phone })
      : await this.userModel.findOne({ email });

    if (login_type === 'manual' && user) {
      if (
        (verification_type === 'phone' && user.is_phone_verified) ||
        (verification_type === 'email' && user.is_email_verified)
      ) {
        return { message: 'Already verified' };
      }

      let verification;
      if (verification_type === 'phone') {
        verification = await this.phoneVerificationModel.findOne({ phone, token: otp });
        if (verification) {
          user.is_phone_verified = true; // ✅ boolean
          await this.phoneVerificationModel.deleteOne({ phone, token: otp });
        }
      } else {
        verification = await this.emailVerificationModel.findOne({ email, token: otp });
        if (verification) {
          user.is_email_verified = true; // ✅ boolean
          await this.emailVerificationModel.deleteOne({ email, token: otp });
        }
      }

      if (verification) {
        await user.save();
        const token = user.f_name ? this.generateToken(user) : null;
        if (guest_id && token) {
          await this.mergeGuestCart(user._id.toString(), guest_id);
        }
        return {
          token,
          is_phone_verified: 1,
          is_email_verified: 1,
          is_personal_info: user.f_name ? 1 : 0,
          is_exist_user: null,
          login_type,
          email: user.email || null,
        };
      } else {
        throw new BadRequestException('OTP does not match');
      }
    }

    if (login_type === 'otp') {
      const verification = await this.phoneVerificationModel.findOne({ phone, token: otp });
      if (!verification) throw new BadRequestException('OTP does not match');

      if (!user) {
        const hashedPassword = await bcrypt.hash(phone, 10);
        const newUser = new this.userModel({
          phone,
          password: hashedPassword,
          is_phone_verified: true, // ✅ boolean
          login_medium: 'otp',
        });
        await newUser.save();
        await this.assignRefCode(newUser);
        return {
          token: null,
          is_phone_verified: 1,
          is_email_verified: 1,
          is_personal_info: 0,
          is_exist_user: null,
          login_type: 'otp',
          email: null,
        };
      }

      user.is_phone_verified = true; // ✅ boolean
      user.login_medium = 'otp';
      await user.save();
      await this.assignRefCode(user);
      await this.phoneVerificationModel.deleteOne({ phone, token: otp });

      const token = user.f_name ? this.generateToken(user) : null;
      if (guest_id && token) {
        await this.mergeGuestCart(user._id.toString(), guest_id);
      }

      return {
        token,
        is_phone_verified: 1,
        is_email_verified: 1,
        is_personal_info: user.f_name ? 1 : 0,
        is_exist_user: null,
        login_type: 'otp',
        email: user.email || null,
      };
    }

    throw new BadRequestException('Not found');
  }

  // 🔥 Firebase Verify
  async firebaseAuthVerify(dto: any) {
    return this.verifyPhoneOrEmail({ ...dto, verification_type: 'phone' });
  }

  // 👻 Guest
  async guestRequest(dto: any) {
    const guest = new this.guestModel(dto);
    await guest.save();
    return {
      message: 'Guest verified',
      guest_id: guest._id.toString(),
    };
  }

  // 📝 Update Info
  async updateInfo(dto: any) {
    const { name, login_type, phone, email, ref_code, guest_id } = dto;
    const [firstName, lastName = ''] = name.split(' ', 2);

    let user;
    if (login_type === 'otp' || login_type === 'manual') {
      user = await this.userModel.findOne({ phone });
    } else {
      user = await this.userModel.findOne({ email });
    }

    if (!user) throw new BadRequestException('User not found');
    if (user.f_name) throw new BadRequestException('Already exists');

    let refBy: Types.ObjectId | null = null; // ✅ Types.ObjectId
    if (ref_code) {
      const refUser = await this.userModel.findOne({ ref_code, status: true });
      if (refUser) refBy = refUser._id;
    }

    user.f_name = firstName;
    user.l_name = lastName;
    user.email = email;
    user.phone = phone;
    user.ref_by = refBy;
    await user.save();

    const token = this.generateToken(user);
    if (guest_id) {
      await this.mergeGuestCart(user._id.toString(), guest_id);
    }

    return {
      token,
      is_phone_verified: 1,
      is_email_verified: 1,
      is_personal_info: 1,
      is_exist_user: null,
      login_type,
      email: user.email || null,
    };
  }

  // 🤝 Drivemond
  async customerLoginFromDrivemond(dto: any) {
    const { phone, token } = dto;
    let user = await this.userModel.findOne({ phone });

    if (!user) {
      const hashedPassword = await bcrypt.hash(phone, 10);
      user = new this.userModel({
        f_name: 'Drivemond',
        l_name: 'User',
        email: `${phone}@drivemond.com`,
        phone,
        password: hashedPassword,
        is_phone_verified: true, // ✅ boolean
      });
      await user.save();
      await this.assignRefCode(user);
    }

    const tokenJwt = this.generateToken(user);
    return {
      token: tokenJwt,
      is_phone_verified: user.is_phone_verified,
    };
  }
}