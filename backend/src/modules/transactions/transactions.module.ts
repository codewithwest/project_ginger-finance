import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { TransactionsResolver } from './transactions.resolver';
import { SavingsModule } from '../savings/savings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    SavingsModule,
  ],
  providers: [TransactionsService, TransactionsResolver],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
