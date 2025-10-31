import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { ModuleSchema } from './schemas/module.schema';
import { StoreSchema } from '../store/schemas/store.schema';
import { ItemSchema } from '../item/schemas/item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Module', schema: ModuleSchema },
      { name: 'Store', schema: StoreSchema },
      { name: 'Item', schema: ItemSchema },
    ]),
  ],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModuleModule {}
