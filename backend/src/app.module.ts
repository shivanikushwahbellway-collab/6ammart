import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
// import { BannerModule } from './banner/banner.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZoneModule } from './zone/zone.module';
import { AuthModule } from './customer/auth.module';
import { ModuleModule } from './module/module.module';
import { HomeModule } from './home/home.module';
import { SocialauthModule } from './auth/socialauth/socialauth.module';
import { ForgotPasswordModule } from './auth/forgotpassword/forgot-password.module';
import { AdminModule } from './auth/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('ATLAS_CONNECTION'),
      }),
      inject: [ConfigService],
    }),
    // BannerModule,
    ZoneModule,
    AuthModule,
    ModuleModule,
    HomeModule,
    SocialauthModule,
    ForgotPasswordModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
