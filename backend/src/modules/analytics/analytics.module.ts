import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TransactionsModule } from '../transactions/transactions.module';
import { AssetsModule } from '../assets/assets.module';
import { SavingsModule } from '../savings/savings.module';
import { FarmCyclesModule } from '../farm-cycles/farm-cycles.module';
import { FinancialGoal, FinancialGoalSchema } from './schemas/goal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FinancialGoal.name, schema: FinancialGoalSchema },
    ]),
    TransactionsModule,
    AssetsModule,
    SavingsModule,
    FarmCyclesModule,
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
