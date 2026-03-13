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

  const expiredSubscriptions = subscriptions.filter(
    sub => sub.status === "EXPIRED"
  ).length;

  const monthlySpending = subscriptions
    .filter(sub => sub.billingCycle === "MONTHLY")
    .reduce((sum, sub) => sum + sub.price, 0);

  const yearlySpending = subscriptions
    .filter(sub => sub.billingCycle === "YEARLY")
    .reduce((sum, sub) => sum + sub.price, 0);

  const today = new Date();

  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const upcomingRenewals = subscriptions.filter(sub => {

    const renewalDate = new Date(sub.renewalDate);

    return renewalDate >= today && renewalDate <= nextWeek;

  }).length;

  // -------------------------
  // SMART AI SUGGESTIONS
  // -------------------------

  const suggestions: { service?: string; message: string }[] = [];

  // 1️⃣ Most expensive subscription
  const mostExpensive = subscriptions.length > 0
    ? subscriptions.reduce((prev, current) =>
        prev.price > current.price ? prev : current
      )
    : null;

  if (mostExpensive) {
    suggestions.push({
      service: mostExpensive.serviceName,
      message: `${mostExpensive.serviceName} is your most expensive subscription (₹${mostExpensive.price}).`
    });
  }

  subscriptions.forEach(sub => {

    const renewalDate = new Date(sub.renewalDate);

    const daysLeft =
      (renewalDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24);

    // 2️⃣ Renewing soon
    if (daysLeft <= 3 && daysLeft >= 0) {
      suggestions.push({
        service: sub.serviceName,
        message: `${sub.serviceName} renews in ${Math.floor(daysLeft)} days.`
      });
    }

    // 3️⃣ Expired subscriptions
    if (sub.status === "EXPIRED") {
      suggestions.push({
        service: sub.serviceName,
        message: `${sub.serviceName} subscription has expired.`
      });
    }

    // 4️⃣ Expensive subscriptions
    if (sub.price > 500) {
      suggestions.push({
        service: sub.serviceName,
        message: `${sub.serviceName} costs ₹${sub.price}. Consider reviewing it.`
      });
    }

    // 5️⃣ Long running subscriptions
    const start = new Date(sub.startDate);

    const monthsUsed =
      (today.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24 * 30);

    if (monthsUsed > 6) {
      suggestions.push({
        service: sub.serviceName,
        message: `You've had ${sub.serviceName} for ${Math.floor(monthsUsed)} months.`
      });
    }

  });

  return {
    message: 'Dashboard data fetched successfully',
    stats: {
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      upcomingRenewals,
      monthlySpending,
      yearlySpending
    },
    suggestions
  };

}
}

