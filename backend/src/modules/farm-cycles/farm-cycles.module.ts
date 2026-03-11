import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FarmCyclesService } from './farm-cycles.service';
import { FarmCyclesController } from './farm-cycles.controller';
import { FarmCycle, FarmCycleSchema } from './schemas/farm-cycle.schema';

import { FarmCyclesResolver } from './farm-cycles.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FarmCycle.name, schema: FarmCycleSchema },
    ]),
  ],
  providers: [FarmCyclesService, FarmCyclesResolver],
  controllers: [FarmCyclesController],
  exports: [FarmCyclesService],
})
export class FarmCyclesModule {}
