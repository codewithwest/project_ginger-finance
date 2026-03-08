import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SavingsAccount, SavingsAccountDocument } from './schemas/savings-account.schema';

@Injectable()
export class SavingsService {
  constructor(@InjectModel(SavingsAccount.name) private savingsModel: Model<SavingsAccountDocument>) {}

  async create(householdId: string, data: any): Promise<SavingsAccountDocument> {
    const account = new this.savingsModel({
      ...data,
      householdId: new Types.ObjectId(householdId),
    });
    
    return await account.save();
  }

  async findAll(householdId: string): Promise<SavingsAccountDocument[]> {
    return await this.savingsModel.find({ householdId: new Types.ObjectId(householdId) }).exec();
  }

  async updateBalance(accountId: string, amount: number): Promise<void> {
    await this.savingsModel.findByIdAndUpdate(accountId, { $inc: { balance: amount } }).exec();
  }
}
