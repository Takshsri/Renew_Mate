import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class RemindersService {

  constructor(private prisma: DatabaseService) {}

  // Runs every day at 9 AM
  @Cron('0 9 * * *')
  async checkRenewals() {

    const today = new Date();

    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    const subscriptions = await this.prisma.subscription.findMany({
      where: {
        renewalDate: {
          lte: threeDaysLater,
          gte: today
        }
      },
      include: {
        user: true
      }
    });

    for (const sub of subscriptions) {

      console.log(`Reminder: ${sub.serviceName} renewing for ${sub.user.email}`);

      // later we will send email here

    }

  }

}