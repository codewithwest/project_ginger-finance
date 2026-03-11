import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../transactions/transactions.service';
import { AssetsService } from '../assets/assets.service';
import { SavingsService } from '../savings/savings.service';
import { FarmCyclesService } from '../farm-cycles/farm-cycles.service';
import { Types } from 'mongoose';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly assetsService: AssetsService,
    private readonly savingsService: SavingsService,
    private readonly farmCyclesService: FarmCyclesService,
  ) {}

  async getNetWorth(userId: string) {
    const assets = await this.assetsService.findAll(userId);
    const savings = await this.savingsService.findAll(userId);

    const totalAssetsValue = assets.reduce(
      (sum, asset) => sum + asset.currentValue,
      0,
    );
    const totalSavings = savings.reduce(
      (sum, account) => sum + account.balance,
      0,
    );

    // In a full implementation, we'd subtract liabilities here
    return {
      totalAssetsValue,
      totalSavings,
      netWorth: totalAssetsValue + totalSavings,
    };
  }

  async getFarmCycleProfitability(cycleId: string) {
    const transactions = await this.transactionsService.findAllByCycle(cycleId);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalExpenses,
      totalIncome,
      netProfit: totalIncome - totalExpenses,
    };
  }
}
