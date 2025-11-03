// src/auth/admin/schemas/admin.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose'; // ✅ Use HydratedDocument (NestJS + Mongoose v7+)

export type AdminDocument = HydratedDocument<Admin>; // ✅ Better than `Admin & Document`

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);