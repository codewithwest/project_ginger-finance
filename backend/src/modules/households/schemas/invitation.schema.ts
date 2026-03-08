import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvitationDocument = Invitation & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Invitation {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  email: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Household', required: true })
  householdId: Types.ObjectId;

  @Field()
  @Prop({ required: true, unique: true })
  token: string;

  @Field()
  @Prop({ required: true, enum: ['ADMIN', 'MEMBER'] })
  role: string;

  @Field()
  @Prop({ required: true, enum: ['pending', 'used'], default: 'pending' })
  status: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
