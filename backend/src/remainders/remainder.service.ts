import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RemindersService {
  constructor(private prisma: DatabaseService) {}

  async getUpcomingRenewals() {
    const today = new Date();

    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    return this.prisma.subscription.findMany({
      where: {
        renewalDate: {
          lte: threeDaysLater,
          gte: today,
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
      console.log(`Reminder: ${sub.serviceName} renewing for ${sub.user.email}`);
    }
  }
}