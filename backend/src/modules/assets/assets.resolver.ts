import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, Request } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { Asset } from './schemas/asset.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateAssetInput } from './dto/create-asset.input';

@Resolver(() => Asset)
export class AssetsResolver {
  constructor(private readonly assetsService: AssetsService) {}

  @Mutation(() => Asset)
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Asset)
  @UseGuards(JwtAuthGuard)
  async createAsset(
    @Request() req: { user: { householdId: string } },
    @Args('input') input: CreateAssetInput,
  ) {
    if (!req.user.householdId) throw new Error('User does not belong to a household');
    return this.assetsService.create(req.user.householdId, input);
  }

  @Query(() => [Asset])
  @UseGuards(JwtAuthGuard)
  async myAssets(@Request() req: { user: { householdId: string } }) {
    if (!req.user.householdId) return [];
    return this.assetsService.findAll(req.user.householdId);
  }

  @Query(() => Asset, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async asset(@Args('id', { type: () => ID }) id: string) {
    return this.assetsService.findOne(id);
  }
}
