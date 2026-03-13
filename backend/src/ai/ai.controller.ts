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
        message:
          "Hello! 👋 I'm RenewMate AI.\nI can help you manage subscriptions.\nTry: 'Add Netflix monthly 499' or 'Show my subscriptions'."
      };
    }

    const aiResponse = await this.aiService.extractSubscription(body.message);

    let parsed: any;

    try {
      const cleaned = aiResponse
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      parsed = JSON.parse(cleaned);

    } catch {
      return {
        message: aiResponse
      };
    }

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

      if (parsed.billingCycle === "WEEKLY") {
        renewalDate.setDate(renewalDate.getDate() + 7);
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
        message: `${parsed.serviceName} subscription added successfully.`,
        subscription
      };
    }

    // SHOW SUBSCRIPTIONS
    if (action === "SHOW_SUBSCRIPTIONS") {

      const subscriptions =
        await this.subscriptionService.findUserSubscriptions(userId);

      if (subscriptions.length === 0) {
        return {
          message:
            "You currently have no subscriptions.\nTry adding one like: 'Add Spotify monthly 119'."
        };
      }

      return {
        message: "Here are your subscriptions:",
        subscriptions
      };
    }

    // CANCEL URL MAP
    const cancelUrls: Record<string, string> = {
      netflix: "https://www.netflix.com/cancelplan",
      spotify: "https://www.spotify.com/account/subscription/",
      amazon: "https://www.amazon.com/gp/video/settings/subscriptions",
      youtube: "https://www.youtube.com/paid_memberships",
      disney: "https://www.disneyplus.com/account",
      prime: "https://www.amazon.com/gp/primecentral",
    };

    // CANCEL SUBSCRIPTION
    if (action === "CANCEL_SUBSCRIPTION") {

      const subscriptions =
        await this.subscriptionService.findUserSubscriptions(userId);

      const sub = subscriptions.find(
        s => s.serviceName.toLowerCase() === parsed.serviceName.toLowerCase()
      );

      if (!sub) {
        return {
          message: `No ${parsed.serviceName} subscription found in RenewMate.`
        };
      }

      await this.subscriptionService.remove(sub.id);

      const serviceKey = parsed.serviceName.toLowerCase();
      const redirectUrl = cancelUrls[serviceKey];

      return {
        message: `${parsed.serviceName} subscription removed from RenewMate.`,
        redirectUrl: redirectUrl || null
      };
    }

    // UPCOMING RENEWALS
    if (action === "UPCOMING_RENEWALS") {

      const subscriptions =
        await this.subscriptionService.findUserSubscriptions(userId);

      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const upcoming = subscriptions.filter(sub =>
        new Date(sub.renewalDate) >= today &&
        new Date(sub.renewalDate) <= nextWeek
      );

      if (upcoming.length === 0) {
        return {
          message: "No subscriptions are renewing in the next 7 days."
        };
      }

      return {
        message: "These subscriptions renew this week:",
        upcoming
      };
    }

    return {
      message: "Sorry, I couldn't understand that command."
    };

  }

}