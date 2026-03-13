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

  // 🔥 Smart suggestion system

const suggestions: { service: string; message: string }[] = [];


// 1️⃣ Find most expensive subscription
const mostExpensive = subscriptions.reduce((prev, current) =>
  prev.price > current.price ? prev : current
);

if (mostExpensive) {
  suggestions.push({
    service: mostExpensive.serviceName,
    message: `${mostExpensive.serviceName} is your most expensive subscription (₹${mostExpensive.price}). Consider reviewing it.`
  });
}

// 2️⃣ Detect subscriptions renewing soon
subscriptions.forEach(sub => {

  const daysLeft =
    (new Date(sub.renewalDate).getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24);

  if (daysLeft <= 5 && daysLeft >= 0) {

    suggestions.push({
      service: sub.serviceName,
      message: `${sub.serviceName} renews in ${Math.floor(daysLeft)} days. Cancel if you are not using it.`
    });

  }

});

// 3️⃣ Detect long running subscriptions
subscriptions.forEach(sub => {

  const start = new Date(sub.startDate);

  const monthsUsed =
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (monthsUsed > 6) {

    suggestions.push({
      service: sub.serviceName,
      message: `You've had ${sub.serviceName} for over ${Math.floor(monthsUsed)} months. Check if you still need it.`
    });

  }

});  return {
    message: 'Dashboard data fetched successfully',
    stats: {
      totalSubscriptions,
      activeSubscriptions,
      upcomingRenewals,
      monthlySpending,
      yearlySpending
    },
    suggestions
  };
}

}