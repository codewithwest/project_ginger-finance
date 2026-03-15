import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { UsersResolver } from './users.resolver';
import { SeedService } from './seed.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailModule,
  ],
  providers: [UsersService, SeedService, UsersResolver],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
