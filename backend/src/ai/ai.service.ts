import { HttpException, Injectable } from '@nestjs/common';
import Groq from "groq-sdk";
import axios from 'axios';
@Injectable()
export class AiService {

  private groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  async extractSubscription(prompt: string): Promise<string> {

    console.log("Prompt received:", prompt);

    const completion = await this.groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `
You are the AI assistant for RenewMate, a subscription tracking platform.

Your job is to convert user messages into JSON commands.

Supported actions:

ADD_SUBSCRIPTION
SHOW_SUBSCRIPTIONS
CANCEL_SUBSCRIPTION
UPCOMING_RENEWALS
GREETING

Rules:
- Always return valid JSON.
- Never return plain text.
- Extract serviceName, price, billingCycle.
- If user provides dates extract startDate.
- renewalDate should only be extracted if user explicitly provides it.
- Dates must be returned in ISO format (YYYY-MM-DD).

Billing cycles allowed:
MONTHLY
YEARLY
WEEKLY

Examples:

User: Add Spotify monthly 119
Response:
{
 "action": "ADD_SUBSCRIPTION",
 "serviceName": "Spotify",
 "price": 119,
 "billingCycle": "MONTHLY"
}

User: Add Netflix monthly 499 starting 2026-03-15
Response:
{
 "action": "ADD_SUBSCRIPTION",
 "serviceName": "Netflix",
 "price": 499,
 "billingCycle": "MONTHLY",
 "startDate": "2026-03-15"
}

User: Add Prime yearly 1499 starting 2026-04-01
Response:
{
 "action": "ADD_SUBSCRIPTION",
 "serviceName": "Prime",
 "price": 1499,
 "billingCycle": "YEARLY",
 "startDate": "2026-04-01"
}

User: show my subscriptions
Response:
{
 "action": "SHOW_SUBSCRIPTIONS"
}

User: cancel my netflix
Response:
{
 "action": "CANCEL_SUBSCRIPTION",
 "serviceName": "Netflix"
}

User: what renews this week
Response:
{
 "action": "UPCOMING_RENEWALS"
}

User: hi
Response:
{
 "action": "GREETING"
}

If you cannot understand the message return:

{
 "action": "UNKNOWN"
}
`
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });

    const result = completion.choices[0]?.message?.content || "";

    console.log("Raw AI result:", result);

    // Remove markdown formatting if AI returns ```json
    const cleaned = result
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    console.log("Cleaned AI JSON:", cleaned);

    return cleaned;
  }
    async getSuggestion(subscription: any) {
    try {
      const response = await axios.post('http://127.0.0.1:5001/predict', {
        serviceName: subscription.serviceName,
        category: subscription.category,
        billingCycle: subscription.billingCycle,
        paymentMethod: subscription.paymentMethod,
        status: subscription.status,
        monthly_spending: subscription.price,
        active_usage_days: this.getActiveDays(subscription.createdAt),
        days_to_renewal: this.getDaysToRenewal(subscription.renewalDate),
      });

      return response.data;
    } catch (error) {
      throw new HttpException(
        'ML prediction service unavailable',
        500,
      );
    }
  }

  private getActiveDays(createdAt: Date): number {
    const now = new Date().getTime();
    const created = new Date(createdAt).getTime();
    return Math.floor((now - created) / (1000 * 60 * 60 * 24));
  }

  private getDaysToRenewal(renewalDate: Date): number {
    const now = new Date().getTime();
    const renewal = new Date(renewalDate).getTime();
    return Math.floor((renewal - now) / (1000 * 60 * 60 * 24));
  }
}