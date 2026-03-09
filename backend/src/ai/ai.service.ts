import { Injectable } from '@nestjs/common';
import Groq from "groq-sdk";

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
You are an AI assistant for the RenewMate subscription tracking app.

You must convert user messages into JSON commands.

Possible actions:

ADD_SUBSCRIPTION
SHOW_SUBSCRIPTIONS
CANCEL_SUBSCRIPTION
UPCOMING_RENEWALS

Return JSON ONLY. Never return normal text.

Examples:

User: Add Spotify monthly 119
Response:
{
 "action": "ADD_SUBSCRIPTION",
 "serviceName": "Spotify",
 "price": 119,
 "billingCycle": "MONTHLY"
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
}