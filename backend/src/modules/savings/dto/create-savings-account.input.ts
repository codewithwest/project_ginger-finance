import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

@InputType()
export class CreateSavingsAccountInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  accountName: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(['bank', 'investment', 'emergency', 'cash'])
  accountType: string;

  @Field(() => Float, { defaultValue: 0 })
  @IsNumber()
  @IsOptional()
  balance: number;

  @Field({ defaultValue: 'ZAR' })
  @IsOptional()
  @IsString()
  currency: string;
}
