import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { SubscriptionsService } from 'src/Subscriptions/subscription.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {

  constructor(
    private aiService: AiService,
    private subscriptionService: SubscriptionsService
  ) {}
@Post('chat')
async chat(@Req() req, @Body() body: any) {

  const userId = req.user.sub;
  const userMessage = body.message.toLowerCase();

  const greetings = ["hi", "hello", "hey", "good morning", "good evening"];

  if (greetings.includes(userMessage)) {
    return {
      message: "Hello! I can help you manage subscriptions. Try 'Add Netflix monthly 499' or 'Show my subscriptions'."
    };
  }
  const aiResponse = await this.aiService.extractSubscription(body.message);

  let cleaned = aiResponse
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  const parsed = JSON.parse(cleaned);

  const action = parsed.action;

  // ADD SUBSCRIPTION
  if (action === "ADD_SUBSCRIPTION") {

    const startDate = new Date();
    let renewalDate = new Date(startDate);

    if (parsed.billingCycle === "MONTHLY") {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    }

    if (parsed.billingCycle === "YEARLY") {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    }

    const subscription = await this.subscriptionService.create({
      serviceName: parsed.serviceName,
      price: parsed.price,
      billingCycle: parsed.billingCycle,
      startDate,
      renewalDate,
      userId
    });

    return {
      message: "Subscription added",
      subscription
    };
  }

  // SHOW SUBSCRIPTIONS
  if (action === "SHOW_SUBSCRIPTIONS") {

    const subscriptions = await this.subscriptionService.findUserSubscriptions(userId);

    return {
      message: "Your subscriptions",
      subscriptions
    };
  }

  // CANCEL SUBSCRIPTION
  if (action === "CANCEL_SUBSCRIPTION") {

    const subscriptions = await this.subscriptionService.findUserSubscriptions(userId);

    const sub = subscriptions.find(
      s => s.serviceName.toLowerCase() === parsed.serviceName.toLowerCase()
    );

    if (!sub) {
      return { message: "Subscription not found" };
    }

    await this.subscriptionService.remove(sub.id);

    return { message: `${parsed.serviceName} subscription cancelled` };
  }

  // UPCOMING RENEWALS
  if (action === "UPCOMING_RENEWALS") {

    const subscriptions = await this.subscriptionService.findUserSubscriptions(userId);

    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcoming = subscriptions.filter(sub =>
      new Date(sub.renewalDate) >= today &&
      new Date(sub.renewalDate) <= nextWeek
    );

    return {
      message: "Subscriptions renewing this week",
      upcoming
    };
  }

  return { message: "Command not recognized." };
}
}