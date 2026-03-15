import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FinancialGoalDocument = FinancialGoal & Document;

@Schema({ timestamps: true })
export class FinancialGoal {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  targetAmount: number;

  @Prop({ type: Number, default: 0 })
  currentAmount: number;

  @Prop({ type: Date })
  deadline: Date;

  @Prop({ type: Boolean, default: false })
  isCompleted: boolean;
}

export const FinancialGoalSchema = SchemaFactory.createForClass(FinancialGoal);
