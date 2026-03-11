import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SavingsService } from './savings.service';
import { SavingsController } from './savings.controller';
import {
  SavingsAccount,
  SavingsAccountSchema,
} from './schemas/savings-account.schema';

import { SavingsResolver } from './savings.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SavingsAccount.name, schema: SavingsAccountSchema },
    ]),
  ],
  providers: [SavingsService, SavingsResolver],
  controllers: [SavingsController],
  exports: [SavingsService],
})
export class SavingsModule {}
