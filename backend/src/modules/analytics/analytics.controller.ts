import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('net-worth')
  async getNetWorth(@Request() req: any) {
    return this.analyticsService.getNetWorth(req.user.userId);
  }

  @Get('farm-cycle/:id')
  async getCycleProfitability(@Param('id') id: string) {
    return this.analyticsService.getFarmCycleProfitability(id);
  }
}
