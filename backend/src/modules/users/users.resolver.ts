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
  async me(@Context() context: any) {
    const userId = context.req.user.userId;
    return this.usersService.findById(userId);
  }

  @Query(() => [User])
  @UseGuards(JwtAuthGuard)
  async users() {
    return [];
  }
}
