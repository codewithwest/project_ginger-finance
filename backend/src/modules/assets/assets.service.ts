import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Asset, AssetDocument } from './schemas/asset.schema';

@Injectable()
export class AssetsService {
  constructor(
    @InjectModel(Asset.name) private assetModel: Model<AssetDocument>,
  ) {}

  async create(householdId: string, data: any): Promise<AssetDocument> {
    const asset = new this.assetModel({
      ...data,
      householdId: new Types.ObjectId(householdId),
    });

    return await asset.save();
  }

  async findAll(householdId: string): Promise<AssetDocument[]> {
    return await this.assetModel
      .find({ householdId: new Types.ObjectId(householdId) })
      .exec();
  }

  async findOne(id: string): Promise<AssetDocument | null> {
    return await this.assetModel.findById(id).exec();
  }

  async update(id: string, updates: any): Promise<AssetDocument | null> {
    return await this.assetModel
      .findByIdAndUpdate(id, updates, { new: true })
      .exec();
  }

  async remove(id: string): Promise<any> {
    return await this.assetModel.findByIdAndDelete(id).exec();
  }
}
