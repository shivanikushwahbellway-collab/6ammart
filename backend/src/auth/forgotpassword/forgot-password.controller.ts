import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { hashPassword } from '../utils/password.utils';
import { v4 as uuidv4 } from 'uuid'; // 👈 Add this

@Controller('auth')
export class ForgotPasswordController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
@Post('forgot-password')
async forgotPassword(@Body('phone') phone: string) {
  if (!phone) {
    throw new BadRequestException('Phone number is required');
  }

  const user = await this.userModel.findOne({ phone }).exec();
  if (!user) {
    throw new HttpException('User not found with this phone number', HttpStatus.NOT_FOUND);
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  user.otp = otp;
  user.otp_expires_at = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  // ✅ OTP ko response mein bhejo (sirf dev ke liye)
  return {
    success: true,
    message: 'OTP sent successfully',
    otp: otp, // 👈 ye line add karein
  };
}

  @Post('verify-otp')
  async verifyOtp(@Body('phone') phone: string, @Body('otp') otp: string) {
    if (!phone || !otp) {
      throw new BadRequestException('Phone and OTP are required');
    }

    const user = await this.userModel.findOne({ phone }).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.otp !== otp) {
      throw new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED);
    }

    if (user.otp_expires_at && user.otp_expires_at < new Date()) {
      throw new HttpException('OTP expired', HttpStatus.UNAUTHORIZED);
    }

    // ✅ Generate reset_token (valid for 10 minutes)
    const resetToken = uuidv4();
    user.reset_token = resetToken;
    user.reset_token_expires_at = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    return {
      success: true,
      message: 'OTP verified successfully',
      reset_token: resetToken, // 👈 UI ko yeh token bhejna hai
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body('reset_token') resetToken: string, // ✅ phone nahi, reset_token
    @Body('new_password') newPassword: string,
    @Body('confirm_password') confirmPassword: string,
  ) {
    if (!resetToken || !newPassword || !confirmPassword) {
      throw new BadRequestException('All fields are required');
    }

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    if (newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters');
    }

    // ✅ Find user by reset_token (not phone!)
    const user = await this.userModel.findOne({
      reset_token: resetToken,
      reset_token_expires_at: { $gt: new Date() },
    }).exec();

    if (!user) {
      throw new HttpException('Invalid or expired reset token', HttpStatus.UNAUTHORIZED);
    }

    // Hash & save
    user.password = await hashPassword(newPassword);
    // Cleanup
    user.otp = undefined;
    user.otp_expires_at = undefined;
    user.reset_token = undefined;
    user.reset_token_expires_at = undefined;
    await user.save();

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }
}
