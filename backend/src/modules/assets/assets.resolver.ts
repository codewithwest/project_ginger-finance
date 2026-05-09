import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { Asset } from './schemas/asset.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAssetInput } from './dto/create-asset.input';
import { UpdateAssetInput } from './dto/update-asset.input';

@Resolver(() => Asset)
export class AssetsResolver {
  constructor(private readonly assetsService: AssetsService) {}

  @Mutation(() => Asset)
  @UseGuards(JwtAuthGuard)
  async createAsset(
    @Context('req') req: any,
    @Args('input', { type: () => CreateAssetInput }) input: CreateAssetInput,
  ) {
    const householdId = req.user?.householdId;
    if (!householdId) throw new Error('User does not belong to a household');
    return this.assetsService.create(householdId, input);
  }

  @Mutation(() => Asset, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async updateAsset(
    @Args('input', { type: () => UpdateAssetInput }) input: UpdateAssetInput,
  ) {
    const { id, ...updates } = input;
    return this.assetsService.update(id, updates);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteAsset(@Args('id', { type: () => ID }) id: string) {
    await this.assetsService.remove(id);
    return true;
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
