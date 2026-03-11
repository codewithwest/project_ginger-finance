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

  @Field()
  @Prop({ required: true })
  accountName: string;

  @Field()
  @Prop({ required: true, enum: ['bank', 'investment', 'emergency', 'cash'] })
  accountType: string;

  @Field(() => Float)
  @Prop({ required: true, default: 0 })
  balance: number;

  @Field()
  @Prop({ required: true, default: 'ZAR' })
  currency: string;
}

export const SavingsAccountSchema =
  SchemaFactory.createForClass(SavingsAccount);
