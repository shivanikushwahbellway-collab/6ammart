import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataSetting, DataSettingDocument } from './schemas/data-setting.schema';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel('data_settings') private dataSettingModel: Model<DataSettingDocument>,
  ) {}

  async getSetting(key: string): Promise<string> {
    const doc = await this.dataSettingModel.findOne({ key }).exec();
    return doc ? doc.value : '';
  }

  async getSettingsByType(type: string): Promise<Record<string, string>> {
    const docs = await this.dataSettingModel.find({ type }).exec();
    const result: Record<string, string> = {};
    docs.forEach(doc => {
      result[doc.key] = doc.value;
    });
    return result;
  }
}