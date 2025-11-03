// src/admin/admin.controller.ts
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Req,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  @Post('signup')
  async signup(@Body() dto: CreateAdminDto) {
    const existing = await this.adminService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email already exists');
    return this.adminService.create(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginAdminDto) {
    const admin = await this.adminService.findByEmail(dto.email);
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const valid = await this.adminService.validatePassword(dto.password, admin.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = { email: admin.email, sub: admin._id.toString() };
    return {
      access_token: this.jwtService.sign(payload),
      admin: { id: admin._id, email: admin.email, name: admin.name },
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }
}
