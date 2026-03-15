import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
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
    @Context('req') req: any,
    @Args('input', { type: () => CreateSavingsAccountInput }) input: CreateSavingsAccountInput,
  ) {
    const householdId = req.user?.householdId;
    if (!householdId) throw new Error('User does not belong to a household');
    return this.savingsService.create(householdId, input);
  }

  @Query(() => [SavingsAccount])
  @UseGuards(JwtAuthGuard)
  async mySavingsAccounts(@Context('req') req: any) {
    const householdId = req.user?.householdId;
    if (!householdId) return [];
    return this.savingsService.findAll(householdId);
  }
}
