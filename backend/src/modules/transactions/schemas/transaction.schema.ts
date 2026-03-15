import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

export type TransactionDocument = Transaction & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Transaction {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Household', required: true })
  householdId: Types.ObjectId;

  @Field(() => String)
  @Prop({
    type: String,
    required: true,
    enum: ['income', 'expense', 'savings'],
  })
  type: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Field(() => Float)
  @Prop({ type: Number, required: true })
  amount: number;

  @Field(() => Date)
  @Prop({ type: Date, required: true })
  date: Date;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  description: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  store: string;

  @Field(() => Boolean)
  @Prop({ type: Boolean, default: false })
  isRecurring: boolean;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'Asset' })
  assetId: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'SavingsAccount' })
  savingsAccountId: Types.ObjectId;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'FarmCycle' })
  farmCycleId: Types.ObjectId;

  @Field(() => [String])
  @Prop([String])
  tags: string[];
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
