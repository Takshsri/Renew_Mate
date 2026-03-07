import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {

  constructor(private dashboardService: DashboardService) {}

  @Get()
  getDashboard(@Req() req: any) {
    return this.dashboardService.getDashboardData(req.user);
  }

}