import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class DashboardService {

  constructor(private prisma: DatabaseService) {}

  async getDashboardData(user: any) {

    const userId = user.sub;

    const subscriptions = await this.prisma.subscription.findMany({
      where: { userId }
    });

    const totalSubscriptions = subscriptions.length;

    const activeSubscriptions = subscriptions.filter(
      sub => sub.status === "ACTIVE"
    ).length;

    // Calculate monthly spending
    const monthlySpending = subscriptions
      .filter(sub => sub.billingCycle === "MONTHLY")
      .reduce((sum, sub) => sum + sub.price, 0);

    // Calculate yearly spending
    const yearlySpending = subscriptions
      .filter(sub => sub.billingCycle === "YEARLY")
      .reduce((sum, sub) => sum + sub.price, 0);

    // Upcoming renewals within 7 days
    const today = new Date();

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingRenewals = subscriptions.filter(sub => {

      const renewalDate = new Date(sub.renewalDate);

      return renewalDate >= today && renewalDate <= nextWeek;

    }).length;

    return {
      message: 'Dashboard data fetched successfully',
      stats: {
        totalSubscriptions,
        activeSubscriptions,
        upcomingRenewals,
        monthlySpending,
        yearlySpending
      }
    };
  }
}