import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BudgetDocument = Budget & Document;

@Schema({ timestamps: true })
export class Budget {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  limit: number;

  @Prop({ type: String, required: true })
  period: string; // e.g., 'monthly', 'yearly'

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date })
  endDate: Date;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
