import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SavingsService } from './savings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('savings')
@UseGuards(JwtAuthGuard)
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post()
  async create(@Request() req: any, @Body() body: any) {
    return this.savingsService.create(req.user.userId, body);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.savingsService.findAll(req.user.userId);
  }
}
