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

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  category: string;

  @Field(() => Float)
  @Prop({ required: true })
  purchasePrice: number;

  @Field()
  @Prop({ required: true })
  purchaseDate: Date;

  @Field(() => Float)
  @Prop({ required: true })
  currentValue: number;

  @Field({ nullable: true })
  @Prop()
  notes: string;

  @Field(() => [String])
  @Prop([String])
  attachments: string[];
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
