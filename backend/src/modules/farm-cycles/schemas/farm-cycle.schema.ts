import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

export type FarmCycleDocument = FarmCycle & Document;

@ObjectType()
@Schema({ timestamps: true })
export class FarmCycle {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Field(() => String)
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  cropType: string;

  @Field(() => Date)
  @Prop({ type: Date, required: true })
  startDate: Date;

  @Field(() => Date, { nullable: true })
  @Prop({ type: Date })
  expectedHarvestDate: Date;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  notes: string;

  @Field(() => Boolean)
  @Prop({ type: Boolean, default: false })
  isCompleted: boolean;
}

export const FarmCycleSchema = SchemaFactory.createForClass(FarmCycle);
