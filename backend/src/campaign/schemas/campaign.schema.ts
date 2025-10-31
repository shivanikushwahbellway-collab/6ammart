import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Campaign {
  @Prop({ required: true })
  title: string;

  @Prop()
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'Module', required: true })
  module_id: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Store' })
  store_ids: Types.ObjectId[];

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ default: true })
  is_running: boolean;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
export type CampaignDocument = Campaign & Document;
