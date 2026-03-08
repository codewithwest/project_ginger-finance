import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './schemas/category.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => [Category])
  @UseGuards(JwtAuthGuard)
  async myCategories(@Context('req') req: { user?: { userId: string } }) {
    const userId = req.user?.userId;
    if (!userId) return [];
    return this.categoriesService.findAll(userId);
  }
}
