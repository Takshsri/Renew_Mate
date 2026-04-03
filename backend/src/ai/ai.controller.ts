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

// ADD SUBSCRIPTION WIZARD
if (
  action === "ADD_SUBSCRIPTION" ||
  body.pendingAction === "ADD_SUBSCRIPTION"
) {
  const fieldMeta = {
    category: {
      question: "What is the category?",
      inputType: "category",
    },
    price: {
      question: "What is the price?",
      inputType: "number",
    },
    billingCycle: {
      question: "Choose billing cycle",
      inputType: "billingCycle",
    },
    paymentMethod: {
      question: "Choose payment method",
      inputType: "paymentMethod",
    },
    startDate: {
      question: "What is the start date?",
      inputType: "date",
    },
    renewalDate: {
      question: "What is the renewal date?",
      inputType: "date",
    },
    invoiceUrl: {
      question: "Upload invoice",
      inputType: "file",
    },
    notes: {
      question: "Add description",
      inputType: "textarea",
    },
  };

  const questionFlow = [
    "category",
    "price",
    "billingCycle",
    "paymentMethod",
    "startDate",
    "renewalDate",
    "invoiceUrl",
    "notes",
  ];

  const draft = body.draft || {};

if (!draft.serviceName && parsed.serviceName) {
  draft.serviceName = parsed.serviceName;
}
  let currentStep = body.currentStep || 0;
  if (body.pendingField) {
    draft[body.pendingField] = body.message;
  }

  if (currentStep < questionFlow.length) {
    const nextField = questionFlow[currentStep];

    return {
      message: fieldMeta[nextField].question,
      pendingAction: "ADD_SUBSCRIPTION",
      pendingField: nextField,
      inputType: fieldMeta[nextField].inputType,
      currentStep: currentStep + 1,
      draft,
    };
  }

const subscription = await this.subscriptionService.create({
  serviceName: draft.serviceName,
  category: draft.category,
  price: Number(draft.price),
  billingCycle: draft.billingCycle,
  paymentMethod: draft.paymentMethod,
  invoiceUrl: draft.invoiceUrl,
  notes: draft.notes,
  startDate: new Date(draft.startDate).toISOString(),
  renewalDate: new Date(draft.renewalDate).toISOString(),
  userId,
});

  return {
    message: `${subscription.serviceName} added successfully ✅`,
    subscription,
  };
}
    //Show Subscriptions
if (action === "SHOW_SUBSCRIPTIONS") {
  const subscriptions =
    await this.subscriptionService.findUserSubscriptions(userId);

  if (subscriptions.length === 0) {
    return {
      message:
        "You currently have no subscriptions.\nTry adding one like: 'Add Spotify monthly 119'."
    };
  }

  const subscriptionList = subscriptions
    .map(
      (sub, index) =>
        `${index + 1}. ${sub.serviceName} - ₹${sub.price} (${sub.billingCycle})`
    )
    .join("\n");

  return {
    message: `📋 Here are your subscriptions:\n\n${subscriptionList}`,
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
    s => s.serviceName.toLowerCase() === parsed.serviceName?.toLowerCase()
  );

  if (!sub) {
    return {
      message: `No ${parsed.serviceName} subscription found in RenewMate.`
    };
  }

  const serviceKey = parsed.serviceName.toLowerCase();
  const redirectUrl = cancelUrls[serviceKey];

  return {
    message:
      `To cancel ${parsed.serviceName}, please visit the official cancellation page.`,
    redirectUrl: redirectUrl || null
  };
}    // UPCOMING RENEWALS
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