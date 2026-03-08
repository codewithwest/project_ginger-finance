import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { Asset, AssetSchema } from './schemas/asset.schema';

import { AssetsResolver } from './assets.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Asset.name, schema: AssetSchema }]),
  ],
  providers: [AssetsService, AssetsResolver],
  controllers: [AssetsController],
  exports: [AssetsService],
})
export class AssetsModule {}
