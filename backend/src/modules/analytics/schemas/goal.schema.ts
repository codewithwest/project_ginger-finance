import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FinancialGoalDocument = FinancialGoal & Document;

@Schema({ timestamps: true })
export class FinancialGoal {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  targetAmount: number;

  @Prop({ default: 0 })
  currentAmount: number;

  @Prop()
  deadline: Date;

  @Prop({ default: false })
  isCompleted: boolean;
}

export const FinancialGoalSchema = SchemaFactory.createForClass(FinancialGoal);
