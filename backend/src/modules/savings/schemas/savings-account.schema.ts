import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

export type SavingsAccountDocument = SavingsAccount & Document;

@ObjectType()
@Schema({ timestamps: true })
export class SavingsAccount {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Household', required: true })
  householdId: Types.ObjectId;

  @Field(() => String)
  @Prop({ type: String, required: true })
  accountName: string;

  @Field(() => String)
  @Prop({
    type: String,
    required: true,
    enum: ['bank', 'investment', 'emergency', 'cash'],
  })
  accountType: string;

  @Field(() => Float)
  @Prop({ type: Number, required: true, default: 0 })
  balance: number;

  @Field(() => String)
  @Prop({ type: String, required: true, default: 'ZAR' })
  currency: string;
}

export const SavingsAccountSchema =
  SchemaFactory.createForClass(SavingsAccount);
