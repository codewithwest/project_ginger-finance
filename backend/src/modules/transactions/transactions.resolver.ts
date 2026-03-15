import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './schemas/transaction.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTransactionInput } from './dto/create-transaction.input';

interface GqlContext {
  req: { user: { householdId: string } };
}

@Resolver(() => Transaction)
export class TransactionsResolver {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Mutation(() => Transaction)
  @UseGuards(JwtAuthGuard)
  async createTransaction(
    @Args('input', { type: () => CreateTransactionInput }) input: CreateTransactionInput,
    @Context('req') req: any,
  ) {
    const householdId = req.user?.householdId;
    if (!householdId) throw new Error('User does not belong to a household');
    return this.transactionsService.create(householdId, input);
  }

  @Query(() => [Transaction])
  @UseGuards(JwtAuthGuard)
  async myTransactions(
    @Context('req') req: any,
    @Args('type', { type: () => String, nullable: true }) type?: string,
    @Args('sort', { type: () => String, nullable: true }) sort?: string,
  ) {
    const householdId = req.user?.householdId;
    if (!householdId) return [];
    return this.transactionsService.findAll(householdId, { type, sort });
  }

  @Query(() => [Transaction])
  @UseGuards(JwtAuthGuard)
  async transactionsByCycle(
    @Args('cycleId', { type: () => ID }) cycleId: string,
  ) {
    return this.transactionsService.findAllByCycle(cycleId);
  }
}
