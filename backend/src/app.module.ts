import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ZoneModule } from './zone/zone.module';
import { AuthModule } from './customer/auth.module';
// import {ModulesModule} from './module/module.module';
@Module({
  imports: [
    //  MongooseModule.forRoot('mongodb://127.0.0.1:27017/sindbad'),
    MongooseModule.forRoot('mongodb+srv://shivanikushwahbellway_db_user:bellway@cluster0.lgnzv6u.mongodb.net/'),
     ZoneModule,
     AuthModule,
    //  ModulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
