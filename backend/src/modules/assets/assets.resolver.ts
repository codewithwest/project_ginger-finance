import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { Asset } from './schemas/asset.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAssetInput } from './dto/create-asset.input';

@Resolver(() => Asset)
export class AssetsResolver {
  constructor(private readonly assetsService: AssetsService) {}

  @Mutation(() => Asset)
  @UseGuards(JwtAuthGuard)
  async createAsset(
    @Context('req') req: any,
    @Args('input') input: CreateAssetInput,
  ) {
    const householdId = req.user?.householdId;
    if (!householdId) throw new Error('User does not belong to a household');
    return this.assetsService.create(householdId, input);
  }

  @Query(() => [Asset])
  @UseGuards(JwtAuthGuard)
  async myAssets(@Context('req') req: any) {
    const householdId = req.user?.householdId;
    if (!householdId) return [];
    return this.assetsService.findAll(householdId);
  }

  @Query(() => Asset, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async asset(@Args('id', { type: () => ID }) id: string) {
    return this.assetsService.findOne(id);
  }
}
