import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FarmCycle, FarmCycleDocument } from './schemas/farm-cycle.schema';

@Injectable()
export class FarmCyclesService {
  constructor(@InjectModel(FarmCycle.name) private farmCycleModel: Model<FarmCycleDocument>) {}

  async create(userId: string, data: any): Promise<FarmCycleDocument> {
    const cycle = new this.farmCycleModel({
      ...data,
      userId: new Types.ObjectId(userId),
    });
    
    return await cycle.save();
  }

  async findAll(userId: string): Promise<FarmCycleDocument[]> {
    return await this.farmCycleModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async findOne(id: string): Promise<FarmCycleDocument | null> {
    return await this.farmCycleModel.findById(id).exec();
  }

  async markAsCompleted(id: string): Promise<FarmCycleDocument | null> {
    return await this.farmCycleModel.findByIdAndUpdate(id, { isCompleted: true }, { new: true }).exec();
  }
}
