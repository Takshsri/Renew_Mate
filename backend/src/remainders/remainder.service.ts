import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RemindersService {
  constructor(private prisma: DatabaseService) {}

async getUpcomingRenewals() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reminderWindow = new Date(today);
  reminderWindow.setDate(today.getDate() + 7);
  reminderWindow.setHours(23, 59, 59, 999);

  return this.prisma.subscription.findMany({
    where: {
      renewalDate: {
        gte: today,
        lte: reminderWindow,
      },
    },
    include: {
      user: true,
    },
  });
}

  @Cron('0 7 * * *')
  async checkRenewals() {
    const subscriptions = await this.getUpcomingRenewals();

    for (const sub of subscriptions) {
      console.log(
        `Reminder: ${sub.serviceName} renewing for ${sub.user.email}`,
      );
    }
  }
}