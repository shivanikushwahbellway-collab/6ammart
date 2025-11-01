import { Body, Controller, Post, UsePipes, ValidationPipe} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SocialAuthDto } from './dto/social-auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('social-register')
  @UsePipes(new ValidationPipe())
  async socialRegister(@Body() dto: SocialAuthDto) {
    return this.authService.socialAuth(dto);
  }
}
