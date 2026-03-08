import { Resolver, Query, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@Context('req') req: any) {
    const userId = req.user?.userId;
    if (!userId) throw new Error('Not authenticated');
    return this.usersService.findById(userId);
  }

  @Query(() => [User])
  @UseGuards(JwtAuthGuard)
  async users() {
    return [];
  }
}
