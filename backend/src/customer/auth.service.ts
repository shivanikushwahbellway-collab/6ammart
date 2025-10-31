import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../Auth/schemas/user.schema';
import { PhoneVerification } from '../Auth/schemas/phone-verification.schema';
import { EmailVerification } from '../Auth/schemas/email-verification.schema';
import { Guest } from '../Auth/schemas/guest.schema';
import { HttpStatus } from '@nestjs/common';

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
    try {
      const { name, email, phone, password, ref_code, guest_id } = dto;
      const [firstName, lastName = ''] = name.split(' ', 2);

      let refBy: Types.ObjectId | null = null;
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
      let isEmailVerified = true;

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
        status: true,
        message: 'User registered successfully ✅',
        data: {
          token,
          is_phone_verified: isPhoneVerified,
          is_email_verified: isEmailVerified,
          is_personal_info: 1,
          is_exist_user: null,
          login_type: 'manual',
          email: user.email || null,
        },
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Registration failed',
        data: {},
      };
    }
  }

  // 🔑 Login
  async login(dto: any) {
    try {
      const { login_type } = dto;
      if (login_type === 'manual') return await this.manualLogin(dto);
      if (login_type === 'otp') return dto.verified ? await this.otpLogin(dto) : await this.sendOtp(dto);
      if (login_type === 'social') return await this.socialLogin(dto);
      throw new BadRequestException('Invalid login type');
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Login failed',
        data: {},
      };
    }
  }

  // 🔐 Manual Login
  async manualLogin(dto: any) {
    try {
      const { email_or_phone, password, field_type, guest_id } = dto;
      const query = field_type === 'email' ? { email: email_or_phone } : { phone: email_or_phone };
      const user = await this.userModel.findOne(query);
      if (!user) throw new UnauthorizedException('User not found');

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
        status: true,
        message: 'Login successful',
        data: {
          token,
          is_phone_verified: 1,
          is_email_verified: 1,
          is_personal_info: user.f_name ? 1 : 0,
          is_exist_user: null,
          login_type: 'manual',
          email: user.email || null,
        },
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Manual login failed',
        data: {},
      };
    }
  }

  // 📲 Send OTP
  async sendOtp(dto: any) {
    try {
      const { phone } = dto;
      const otpInterval = 60; // seconds

      const existing = await this.phoneVerificationModel.findOne({ phone });

      if (
        existing &&
        existing.updatedAt &&
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
        status: true,
        message: 'OTP sent successfully',
        data: {
          token: null,
          is_phone_verified: 0,
          is_email_verified: 1,
          is_personal_info: 1,
          is_exist_user: null,
          login_type: 'otp',
          email: null,
        },
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Failed to send OTP',
        data: {},
      };
    }
  }

  // ✅ OTP Login
  async otpLogin(dto: any) {
    try {
      const { phone, otp, guest_id } = dto;
      const verification = await this.phoneVerificationModel.findOne({ phone, token: otp });
      if (!verification) throw new BadRequestException('OTP does not match');

      let user = await this.userModel.findOne({ phone });
      if (!user) {
        const hashedPassword = await bcrypt.hash(phone, 10);
        user = new this.userModel({
          phone,
          password: hashedPassword,
          is_phone_verified: true,
          login_medium: 'otp',
        });
        await user.save();
        await this.assignRefCode(user);
      } else {
        if (!user.status) throw new UnauthorizedException('Account blocked');
        user.is_phone_verified = true;
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
        status: true,
        message: 'OTP login successful',
        data: {
          token,
          is_phone_verified: 1,
          is_email_verified: 1,
          is_personal_info: user.f_name ? 1 : 0,
          is_exist_user: null,
          login_type: 'otp',
          email: user.email || null,
        },
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'OTP login failed',
        data: {},
      };
    }
  }

  // 🌐 Social Login
  async socialLogin(dto: any) {
    try {
      const { email, medium, unique_id, guest_id } = dto;
      let user = await this.userModel.findOne({ email });

      if (!user) {
        user = new this.userModel({
          email,
          login_medium: medium,
          temp_token: unique_id,
          is_email_verified: true,
        });
        await user.save();
        await this.assignRefCode(user);
      } else {
        if (!user.status) throw new UnauthorizedException('Account blocked');
        user.login_medium = medium;
        user.is_email_verified = true;
        await user.save();
        await this.assignRefCode(user);
      }

      const token = user.f_name ? this.generateToken(user) : null;
      if (guest_id && token) {
        await this.mergeGuestCart(user._id.toString(), guest_id);
      }

      return {
        status: true,
        message: 'Social login successful',
        data: {
          token,
          is_phone_verified: 1,
          is_email_verified: 1,
          is_personal_info: user.f_name ? 1 : 0,
          is_exist_user: null,
          login_type: 'social',
          email: user.email || null,
        },
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Social login failed',
        data: {},
      };
    }
  }

  // ✅ Verify OTP
  async verifyPhoneOrEmail(dto: any) {
    try {
      const { otp, verification_type, phone, email, login_type, guest_id } = dto;
      const user = phone
        ? await this.userModel.findOne({ phone })
        : await this.userModel.findOne({ email });

      if (login_type === 'manual' && user) {
        if (
          (verification_type === 'phone' && user.is_phone_verified) ||
          (verification_type === 'email' && user.is_email_verified)
        ) {
          return {
            status: true,
            message: 'Already verified',
            data: {},
          };
        }

        let verification;
        if (verification_type === 'phone') {
          verification = await this.phoneVerificationModel.findOne({ phone, token: otp });
          if (verification) {
            user.is_phone_verified = true;
            await this.phoneVerificationModel.deleteOne({ phone, token: otp });
          }
        } else {
          verification = await this.emailVerificationModel.findOne({ email, token: otp });
          if (verification) {
            user.is_email_verified = true;
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
            status: true,
            message: 'Verification successful',
            data: {
              token,
              is_phone_verified: 1,
              is_email_verified: 1,
              is_personal_info: user.f_name ? 1 : 0,
              is_exist_user: null,
              login_type,
              email: user.email || null,
            },
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
            is_phone_verified: true,
            login_medium: 'otp',
          });
          await newUser.save();
          await this.assignRefCode(newUser);
          return {
            status: true,
            message: 'User created and verified via OTP',
            data: {
              token: null,
              is_phone_verified: 1,
              is_email_verified: 1,
              is_personal_info: 0,
              is_exist_user: null,
              login_type: 'otp',
              email: null,
            },
          };
        }

        user.is_phone_verified = true;
        user.login_medium = 'otp';
        await user.save();
        await this.assignRefCode(user);
        await this.phoneVerificationModel.deleteOne({ phone, token: otp });

        const token = user.f_name ? this.generateToken(user) : null;
        if (guest_id && token) {
          await this.mergeGuestCart(user._id.toString(), guest_id);
        }

        return {
          status: true,
          message: 'OTP verification successful',
          data: {
            token,
            is_phone_verified: 1,
            is_email_verified: 1,
            is_personal_info: user.f_name ? 1 : 0,
            is_exist_user: null,
            login_type: 'otp',
            email: user.email || null,
          },
        };
      }

      throw new BadRequestException('Not found');
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Verification failed',
        data: {},
      };
    }
  }

  // 🔥 Firebase Verify
  async firebaseAuthVerify(dto: any) {
    try {
      const result = await this.verifyPhoneOrEmail({ ...dto, verification_type: 'phone' });
      return result;
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Firebase verification failed',
        data: {},
      };
    }
  }

  // 👻 Guest
  async guestRequest(dto: any) {
    try {
      const guest = new this.guestModel(dto);
      await guest.save();
      return {
        status: true,
        message: 'Guest verified',
        data: {
          guest_id: guest._id.toString(),
        },
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Guest request failed',
        data: {},
      };
    }
  }

  // 📝 Update Info
  async updateInfo(dto: any) {
    try {
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

      let refBy: Types.ObjectId | null = null;
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
        status: true,
        message: 'User info updated successfully',
        data: {
          token,
          is_phone_verified: 1,
          is_email_verified: 1,
          is_personal_info: 1,
          is_exist_user: null,
          login_type,
          email: user.email || null,
        },
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Failed to update info',
        data: {},
      };
    }
  }

  // 🤝 Drivemond
  async customerLoginFromDrivemond(dto: any) {
    try {
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
          is_phone_verified: true,
        });
        await user.save();
        await this.assignRefCode(user);
      }

      const tokenJwt = this.generateToken(user);
      return {
        status: true,
        message: 'Drivemond login successful',
        data: {
          token: tokenJwt,
          is_phone_verified: user.is_phone_verified,
        },
      };
    } catch (error) {
      return {
        status: false,
        message: error.message || 'Drivemond login failed',
        data: {},
      };
    }
  }
}