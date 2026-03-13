import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionStatus } from '@prisma/client';
@Injectable()
export class SubscriptionsService {

  constructor(private prisma: DatabaseService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto, invoiceUrl?: string) {

    const startDate = new Date(createSubscriptionDto.startDate);
    const renewalDate = new Date(createSubscriptionDto.renewalDate);
    const today = new Date();

    // VALIDATION 1
    if (renewalDate <= startDate) {
      throw new BadRequestException(
        "Renewal date must be after start date"
      );
    }

    // VALIDATION 2 (optional)
    if (startDate > today) {
      throw new BadRequestException(
        "Start date cannot be in the future"
      );
    }

    // AUTO STATUS CHECK
let status: SubscriptionStatus = SubscriptionStatus.ACTIVE;

if (renewalDate < today) {
  status = SubscriptionStatus.EXPIRED;
}

    return this.prisma.subscription.create({
      data: {
        serviceName: createSubscriptionDto.serviceName,
        price: Number(createSubscriptionDto.price),
        billingCycle: createSubscriptionDto.billingCycle,
        startDate,
        renewalDate,
        userId: createSubscriptionDto.userId,
        invoiceUrl,
        status
      }
    });

  }

  async findAll() {

    return this.prisma.subscription.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

  }

  async findUserSubscriptions(userId: string) {

    const subscriptions = await this.prisma.subscription.findMany({
      where: { userId }
    });

    const today = new Date();

    // Auto update expired subscriptions
    for (const sub of subscriptions) {

      if (new Date(sub.renewalDate) < today && sub.status === "ACTIVE") {

        await this.prisma.subscription.update({
          where: { id: sub.id },
          data: { status: "EXPIRED" }
        });

        sub.status = "EXPIRED";
      }

    }

    return subscriptions;

  }

  async remove(id: string) {

    return this.prisma.subscription.delete({
      where: { id }
    });

  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {

    return this.prisma.subscription.update({
      where: { id },
      data: updateSubscriptionDto
    });

  }

}