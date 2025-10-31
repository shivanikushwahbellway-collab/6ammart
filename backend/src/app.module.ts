import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BannerModule } from './banner/banner.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ZoneModule } from './zone/zone.module';
import { AuthModule } from './customer/auth.module';
import { ModuleModule } from './module/module.module';

@Module({
  imports: [
    MongooseModule.forRoot('altas_connection'),
    BannerModule,
    ZoneModule,
    AuthModule,
    ModuleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
