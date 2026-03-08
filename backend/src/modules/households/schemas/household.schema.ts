import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type HouseholdDocument = Household & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Household {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field(() => [User])
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  members: User[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const HouseholdSchema = SchemaFactory.createForClass(Household);
