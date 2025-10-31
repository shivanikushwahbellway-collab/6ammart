// src/banner/banner.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { Banner, BannerSchema } from './schemas/banner.schema';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Banner.name, schema: BannerSchema },
      // ❌ Zone, Module, Store schemas REMOVED
    ]),
    CacheModule.register(),
  ],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}