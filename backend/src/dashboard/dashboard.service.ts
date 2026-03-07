import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {

  getDashboardData(user: any) {
    return {
      message: 'Dashboard data fetched successfully',
      user,
      stats: {
        totalSubscriptions: 5,
        activeSubscriptions: 3,
        upcomingRenewals: 2,
      },
    };
  }

}