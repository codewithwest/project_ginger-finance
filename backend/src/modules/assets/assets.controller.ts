import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('assets')
@UseGuards(JwtAuthGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  async create(@Request() req: any, @Body() body: any) {
    return this.assetsService.create(req.user.userId, body);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.assetsService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.assetsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.assetsService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.assetsService.remove(id);
  }
}
