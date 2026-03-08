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

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  cropType: string;

  @Field()
  @Prop({ required: true })
  startDate: Date;

  @Field({ nullable: true })
  @Prop()
  expectedHarvestDate: Date;

  @Field({ nullable: true })
  @Prop()
  notes: string;

  @Field()
  @Prop({ default: false })
  isCompleted: boolean;
}

export const FarmCycleSchema = SchemaFactory.createForClass(FarmCycle);
