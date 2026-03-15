import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

export type CategoryDocument = Category & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Category {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Field(() => String)
  @Prop({ type: String, required: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  icon: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String })
  color: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
