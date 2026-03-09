import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {

  constructor(private prisma: DatabaseService) {}

  async create(createSubscriptionDto: CreateSubscriptionDto) {

  return this.prisma.subscription.create({
    data: {
      serviceName: createSubscriptionDto.serviceName,
      price: createSubscriptionDto.price,
      billingCycle: createSubscriptionDto.billingCycle,
      startDate: new Date(createSubscriptionDto.startDate),
      renewalDate: new Date(createSubscriptionDto.renewalDate),
      userId: createSubscriptionDto.userId
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

    return this.prisma.subscription.findMany({
      where: { userId }
    });

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