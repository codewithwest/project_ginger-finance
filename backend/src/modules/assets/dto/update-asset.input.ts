import { InputType, Field, Float, ID, PartialType } from '@nestjs/graphql';
import { CreateAssetInput } from './create-asset.input';

@InputType()
export class UpdateAssetInput extends PartialType(CreateAssetInput) {
  @Field(() => ID)
  id: string;
}
