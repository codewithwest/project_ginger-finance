import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateSavingsAccountInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  accountName: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsEnum(['bank', 'investment', 'emergency', 'cash'])
  accountType: string;

  @Field(() => Float, { defaultValue: 0 })
  @IsNumber()
  @IsOptional()
  balance: number;

  @Field(() => String, { defaultValue: 'ZAR' })
  @IsOptional()
  @IsString()
  currency: string;
}
