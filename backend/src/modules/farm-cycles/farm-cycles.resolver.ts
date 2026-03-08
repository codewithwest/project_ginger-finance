import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FarmCyclesService } from './farm-cycles.service';
import { FarmCycle } from './schemas/farm-cycle.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => FarmCycle)
export class FarmCyclesResolver {
  constructor(private readonly farmCyclesService: FarmCyclesService) {}

  @Query(() => [FarmCycle])
  @UseGuards(JwtAuthGuard)
  async myFarmCycles(@Args('userId', { type: () => ID }) userId: string) {
    return this.farmCyclesService.findAll(userId);
  }

  @Query(() => FarmCycle, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async farmCycle(@Args('id', { type: () => ID }) id: string) {
    return this.farmCyclesService.findOne(id);
  }
}
