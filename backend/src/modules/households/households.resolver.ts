import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { HouseholdsService } from './households.service';
import { Household } from './schemas/household.schema';
import { Invitation } from './schemas/invitation.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface JwtUser {
  _id: string;
  role: string;
  householdId?: string;
}

@Resolver(() => Household)
export class HouseholdsResolver {
  constructor(private householdsService: HouseholdsService) {}

  /**
   * SUPER_ADMIN only: creates a new household and generates an ADMIN invite link
   * (sent automatically by mail).
   */
  @Mutation(() => Invitation)
  @UseGuards(JwtAuthGuard)
  async createHouseholdAndAdminInvite(
    @Args('name') name: string,
    @Args('adminEmail') adminEmail: string,
    @CurrentUser() user: JwtUser,
  ) {
    if (user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only SUPER_ADMIN can create households');
    }
    return this.householdsService.createHouseholdAndAdminInvite(name, adminEmail);
  }

  /**
   * ADMIN or SUPER_ADMIN: invite a new member to the household by email.
   */
  @Mutation(() => Invitation)
  @UseGuards(JwtAuthGuard)
  async inviteMember(
    @Args('email') email: string,
    @CurrentUser() user: JwtUser,
  ) {
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only ADMIN or SUPER_ADMIN can invite members');
    }
    if (!user.householdId) {
      throw new ForbiddenException('User does not belong to a household');
    }
    return this.householdsService.inviteMember(user.householdId.toString(), email);
  }

  @Query(() => Household, { nullable: true })
  @UseGuards(JwtAuthGuard)
  async myHousehold(@CurrentUser() user: JwtUser) {
    if (!user.householdId) return null;
    return this.householdsService.getMyHousehold(user.householdId.toString());
  }
}
