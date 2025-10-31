import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {RegisterDto} from './dto/register.dto';
import { LoginDto} from './dto/login.dto';
// import{VerifyotpDto} from './dto/verify-otp.dto';
// import{FirebaseVerifyDto } from './dto/firebase-verify.dto';
import{GuestRequestDto} from './dto/guest-request.dto'
  // UpdateInfoDto,
  // ExternalLoginDto,

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // @Post('verify-phone')
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  // verifyPhoneOrEmail(@Body() dto: VerifyOtpDto) {
  //   return this.authService.verifyPhoneOrEmail(dto);
  // }

  // @Post('firebase-verify-token')
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  // firebaseVerify(@Body() dto: FirebaseVerifyDto) {
  //   return this.authService.firebaseAuthVerify(dto);
  // }

  @Post('guest/request')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  guestRequest(@Body() dto: GuestRequestDto) {
    return this.authService.guestRequest(dto);
  }

  // @Post('update-info')
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  // updateInfo(@Body() dto: UpdateInfoDto) {
  //   return this.authService.updateInfo(dto);
  // }

  // @Post('external-login')
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  // externalLogin(@Body() dto: ExternalLoginDto) {
  //   return this.authService.customerLoginFromDrivemond(dto);
  // }
}