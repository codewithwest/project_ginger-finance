import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDate,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateAssetInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  category: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  purchasePrice: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  currentValue: number;

  @Field(() => Date)
  @IsNotEmpty()
  @IsDate()
  purchaseDate: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  hasLoan?: boolean;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  loanBalance?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  loanTerm?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  monthlyPayment?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  interestRate?: number;
}
