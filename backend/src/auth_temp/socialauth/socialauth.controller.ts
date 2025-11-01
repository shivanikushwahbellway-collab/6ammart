import {Controller, Post, Body, HttpException,HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema'; // ✅ UserDocument bhi import karein

@Controller('auth')
export class SocialauthController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, // ✅ User.name, not User.f_name
  ) {}

  @Post('google-login')
  async googleLogin(
    @Body('email') email: string,
    @Body('name') name: string,
    @Body('image') image?: string,
  ) {
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    if (!name || name.trim() === '') {
      throw new HttpException('Name is required', HttpStatus.BAD_REQUEST);
    }

    let user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      // ✅ Schema ke mutabiq: f_name, email, image
      user = new this.userModel({
        email,
        f_name: name.trim(), // ✅ "name" ko "f_name" mein save karein
        image,
        login_medium: 'google', // optional: login medium track karein
      });
      await user.save();
    }

    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.f_name,
        image: user.image,
      },
    };
  }
}
