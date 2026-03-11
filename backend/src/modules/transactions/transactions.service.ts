import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { SavingsService } from '../savings/savings.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private readonly savingsService: SavingsService,
  ) {}

  async create(householdId: string, data: any): Promise<TransactionDocument> {
    const transaction = new this.transactionModel({
      ...data,
      householdId: new Types.ObjectId(householdId),
    });
    // If savings transaction with an account, update its balance
    if (data.type === 'savings' && data.savingsAccountId) {
      await this.savingsService.updateBalance(
        data.savingsAccountId as string,
        data.amount as number,
      );
    }

    return await transaction.save();
  }

  async findAll(
    householdId: string,
    query: any,
  ): Promise<TransactionDocument[]> {
    const filter: any = { householdId: new Types.ObjectId(householdId) };
    if (query.type) filter.type = query.type;

    const sort: any = {};
    if (query.sort === 'date_asc') {
      sort.date = 1;
    } else {
      sort.date = -1; // Default to descending
    }

    return await this.transactionModel.find(filter).sort(sort).exec();
  }

  async findOne(id: string): Promise<TransactionDocument | null> {
    return await this.transactionModel.findById(id).exec();
  }

  async update(id: string, updates: any): Promise<TransactionDocument | null> {
    return await this.transactionModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();
  }

  async findAllByCycle(cycleId: string): Promise<TransactionDocument[]> {
    return await this.transactionModel
      .find({ farmCycleId: new Types.ObjectId(cycleId) })
      .exec();
  }

  async remove(id: string): Promise<any> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (
      transaction &&
      transaction.type === 'savings' &&
      transaction.savingsAccountId
    ) {
      await this.savingsService.updateBalance(
        transaction.savingsAccountId.toString(),
        -transaction.amount,
      );
    }
    return await this.transactionModel.findByIdAndDelete(id).exec();
  }
}
