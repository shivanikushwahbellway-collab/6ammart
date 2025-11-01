import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { DataSetting, DataSettingSchema } from './schemas/data-setting.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'data_settings', schema: DataSettingSchema },
    ]),
  ],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}