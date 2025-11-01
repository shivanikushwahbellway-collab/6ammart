import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DataSettingDocument = DataSetting & Document;

@Schema({ _id: false })
export class DataSetting {
  @Prop({ required: true, unique: true })
  key: string;

  @Prop({ required: true })
  value: string;

  @Prop()
  type: string;
}

export const DataSettingSchema = SchemaFactory.createForClass(DataSetting);
