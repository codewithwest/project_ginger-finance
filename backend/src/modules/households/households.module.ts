import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HouseholdsService } from './households.service';
import { HouseholdsResolver } from './households.resolver';
import { Household, HouseholdSchema } from './schemas/household.schema';
import { Invitation, InvitationSchema } from './schemas/invitation.schema';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Household.name, schema: HouseholdSchema },
      { name: Invitation.name, schema: InvitationSchema },
    ]),
    MailModule,
  ],
  providers: [HouseholdsService, HouseholdsResolver],
  exports: [HouseholdsService],
})
export class HouseholdsModule {}
