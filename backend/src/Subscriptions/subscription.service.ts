import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
  category: createSubscriptionDto.category || null,
  paymentMethod: createSubscriptionDto.paymentMethod || null,
  notes: createSubscriptionDto.notes || null,
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
async findOne(id: string) {
  const subscription = await this.prisma.subscription.findUnique({
    where: { id },
  });
   if (!subscription) {
    throw new NotFoundException("Subscription not found");
  }

  return subscription;
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

  const updatedSubscriptions = subscriptions.map(sub => {

    const renewalDate = new Date(sub.renewalDate);

    const status = renewalDate < today ? "EXPIRED" : "ACTIVE";

    return {
      ...sub,
      status
    };

  });

  return updatedSubscriptions;
}
  async remove(id: string) {

    return this.prisma.subscription.delete({
      where: { id }
    });

  }

async update(
  id: string,
  dto: UpdateSubscriptionDto,
  invoiceUrl?: string,
) {
  return this.prisma.subscription.update({
    where: { id },
    data: {
      ...dto,
      ...(invoiceUrl && { invoiceUrl }),
      price: dto.price ? Number(dto.price) : undefined,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      renewalDate: dto.renewalDate
        ? new Date(dto.renewalDate)
        : undefined,
    },
  });
}
async getUpcomingRenewals(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const next7Days = new Date(today);
  next7Days.setDate(today.getDate() + 7);
  next7Days.setHours(23, 59, 59, 999);

  return this.prisma.subscription.findMany({
    where: {
      userId,
      renewalDate: {
        gte: today,
        lte: next7Days,
      },
    },
    orderBy: {
      renewalDate: "asc",
    },
  });
}
async getSubscriptionById(id: string) {
  return this.prisma.subscription.findUnique({
    where: { id },
  });
}
}