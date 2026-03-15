import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

export type AssetDocument = Asset & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Asset {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Household', required: true })
  householdId: Types.ObjectId;

  @Field(() => String)
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  category: string;

  @Field(() => Float)
  @Prop({ type: Number, required: true })
  purchasePrice: number;

  @Field(() => Date)
  @Prop({ type: Date, required: true })
  purchaseDate: Date;

  @Field(() => Float)
  @Prop({ type: Number, required: true })
  currentValue: number;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  notes: string;

  @Field(() => [String])
  @Prop([String])
  attachments: string[];
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
