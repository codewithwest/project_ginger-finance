import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category, CategorySchema } from './schemas/category.schema';
import { CategoriesResolver } from './categories.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
  providers: [CategoriesService, CategoriesResolver],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
