import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async create(userId: string, data: any): Promise<CategoryDocument> {
    const category = new this.categoryModel({
      ...data,
      userId: new Types.ObjectId(userId),
    });
    
    return await category.save();
  }

  async findAll(userId: string): Promise<CategoryDocument[]> {
    return await this.categoryModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  async update(id: string, updates: any): Promise<CategoryDocument | null> {
    return await this.categoryModel.findByIdAndUpdate(id, updates, { new: true }).exec();
  }

  async remove(id: string): Promise<any> {
    return await this.categoryModel.findByIdAndDelete(id).exec();
  }
}
