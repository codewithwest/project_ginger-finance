import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, Request } from '@nestjs/common';
import { SavingsService } from './savings.service';
import { SavingsAccount } from './schemas/savings-account.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSavingsAccountInput } from './dto/create-savings-account.input';

@Resolver(() => SavingsAccount)
export class SavingsResolver {
  constructor(private readonly savingsService: SavingsService) {}

  @Mutation(() => SavingsAccount)
  @UseGuards(JwtAuthGuard)
  async createSavingsAccount(
    @Request() req: { user: { householdId: string } },
    @Args('input') input: CreateSavingsAccountInput,
  ) {
    if (!req.user.householdId) throw new Error('User does not belong to a household');
    return this.savingsService.create(req.user.householdId, input);
  }

  @Query(() => [SavingsAccount])
  @UseGuards(JwtAuthGuard)
  async mySavingsAccounts(@Request() req: { user: { householdId: string } }) {
    if (!req.user.householdId) return [];
    return this.savingsService.findAll(req.user.householdId);
  }
}
