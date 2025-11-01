import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { PhoneVerification } from '../schemas/phone-verification.schema';
import axios from 'axios';
// src/auth/socialauth/auth.service.ts
import { SocialAuthDto } from './dto/social-auth.dto'; // ✅ exactly this path

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PhoneVerification.name) private phoneVerificationModel: Model<PhoneVerification>,
  ) {}

  private async verifyGoogleToken(token: string, isIdToken = false) {
    const url = isIdToken
      ? `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
      : `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`;
    const { data } = await axios.get(url);
    return { email: data.email, name: data.name, id: data.sub || data.id };
  }

  private async verifyFacebookToken(accessToken: string, userId: string) {
    const { data } = await axios.get(
      `https://graph.facebook.com/${userId}?access_token=${accessToken}&fields=name,email`
    );
    return { email: data.email, name: data.name, id: data.id };
  }

  private verifyAppleIdToken(idToken: string) {
    try {
      const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
      return { email: payload.email, name: payload.email.split('@')[0], id: payload.sub };
    } catch {
      throw new BadRequestException('Invalid Apple token');
    }
  }

  async socialAuth(dto: SocialAuthDto) {
    const { medium, token, unique_id, email, phone, ref_code, id_token } = dto;

    // ✅ Phone must be unique
    if (await this.userModel.findOne({ phone })) {
      throw new ConflictException('Phone already exists');
    }

    // ✅ Email unique for Google/FB
    if (['google', 'facebook'].includes(medium)) {
      if (await this.userModel.findOne({ email })) {
        throw new ConflictException('Email already exists');
      }
    }

    let verifiedData: { email: string; name: string; id: string };

    if (medium === 'google') {
      verifiedData = await this.verifyGoogleToken(token, id_token);
      if (verifiedData.email !== email) {
        throw new BadRequestException('Email does not match');
      }
    } else if (medium === 'facebook') {
      verifiedData = await this.verifyFacebookToken(token, unique_id);
      if (verifiedData.email !== email) {
        throw new BadRequestException('Email does not match');
      }
    } else if (medium === 'apple') {
      verifiedData = this.verifyAppleIdToken(token);
    } else {
      throw new BadRequestException('Invalid medium');
    }

    const nameParts = verifiedData.name.split(' ');
    const f_name = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0];
    const l_name = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

    const newUser = new this.userModel({
      f_name,
      l_name,
      email: medium === 'apple' ? verifiedData.email : email,
      phone,
      login_medium: medium,
      social_id: verifiedData.id,
      temp_token: medium === 'apple' ? unique_id : undefined,
      status: true,
      is_phone_verified: false,
    });

    await newUser.save();

    return {
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        email: newUser.email,
        phone: newUser.phone,
        is_phone_verified: newUser.is_phone_verified,
      },
    };
  }
}