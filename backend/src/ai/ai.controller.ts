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


const pendingField = body.pendingField;

if (body.pendingAction === "ADD_SUBSCRIPTION" && pendingField) {
  parsed = {
    action: "ADD_SUBSCRIPTION",
    ...(body.draft || {}),
    [pendingField]: body.message
  };
} else {
  const aiResponse = await this.aiService.extractSubscription(body.message);

  try {
    parsed = JSON.parse(
      aiResponse.replace(/```json/g, "").replace(/```/g, "").trim()
    );
  } catch {
    return {
      message: aiResponse
    };
  }
}
    // ADD SUBSCRIPTION

if (action === "ADD_SUBSCRIPTION") {
  const fieldMeta = {
    serviceName: {
      question: "What is the service name?",
      inputType: "text"
    },
    category: {
      question: "What is the category?",
      inputType: "text"
    },
    price: {
      question: "What is the subscription price?",
      inputType: "number"
    },
    billingCycle: {
      question: "Choose the billing cycle",
      inputType: "billingCycle"
    },
    paymentMethod: {
      question: "Choose the payment method",
      inputType: "paymentMethod"
    },
    startDate: {
      question: "What is the start date?",
      inputType: "date"
    },
    renewalDate: {
      question: "What is the renewal date?",
      inputType: "date"
    },
    invoiceUrl: {
      question: "Upload invoice or enter invoice URL",
      inputType: "file"
    },
    notes: {
      question: "Add notes about this subscription",
      inputType: "textarea"
    }
  };

  const requiredFields = [
    "serviceName",
    "category",
    "price",
    "billingCycle",
    "paymentMethod",
    "startDate",
    "renewalDate",
    "invoiceUrl",
    "notes"
  ];

  const missingField = requiredFields.find(
    (field) => !parsed[field]
  );

  if (missingField) {
    return {
      message: fieldMeta[missingField].question,
      pendingAction: "ADD_SUBSCRIPTION",
      pendingField: missingField,
      inputType: fieldMeta[missingField].inputType
    };
  }

  const subscription = await this.subscriptionService.create({
    serviceName: parsed.serviceName,
    category: parsed.category,
    price: Number(parsed.price),
    billingCycle: parsed.billingCycle,
    paymentMethod: parsed.paymentMethod,
    invoiceUrl: parsed.invoiceUrl,
    notes: parsed.notes,
    startDate: new Date(parsed.startDate).toISOString(),
    renewalDate: new Date(parsed.renewalDate).toISOString(),
    userId
  });

  return {
    message: `${parsed.serviceName} subscription added successfully ✅`,
    subscription
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