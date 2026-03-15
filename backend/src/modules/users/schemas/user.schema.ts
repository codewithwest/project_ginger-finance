import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

export type UserDocument = User & Document;

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  _id: string;

  @Field(() => String)
  @Prop({ type: String, required: true, unique: true, minlength: 3 })
  username: string;

  @Field(() => String)
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  passwordHash: string;

  @Field(() => String)
  @Prop({
    type: String,
    default: 'MEMBER',
    enum: ['SUPER_ADMIN', 'ADMIN', 'MEMBER'],
  })
  role: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'Household' })
  householdId?: Types.ObjectId;

  @Prop({ type: String })
  refreshToken: string;

  @Prop({ type: String, nullable: true })
  passwordResetToken?: string;

  @Prop({ type: Date, nullable: true })
  passwordResetExpiry?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
