import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FarmCyclesService } from './farm-cycles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('farm-cycles')
@UseGuards(JwtAuthGuard)
export class FarmCyclesController {
  constructor(private readonly farmCyclesService: FarmCyclesService) {}

  @Post()
  async create(@Request() req: any, @Body() body: any) {
    return this.farmCyclesService.create(req.user.userId, body);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.farmCyclesService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.farmCyclesService.findOne(id);
  }

  @Put(':id/complete')
  async complete(@Param('id') id: string) {
    return this.farmCyclesService.markAsCompleted(id);
  }
}
