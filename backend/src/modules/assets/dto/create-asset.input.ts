import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

@InputType()
export class CreateAssetInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
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

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
