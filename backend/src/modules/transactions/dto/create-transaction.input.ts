import { InputType, Field, Float, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsDate,
} from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @Field(() => String)
  @IsNotEmpty()
  @IsEnum(['income', 'expense'])
  type: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  date?: Date;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  assetId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  savingsAccountId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString()
  cycleId?: string;

  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
