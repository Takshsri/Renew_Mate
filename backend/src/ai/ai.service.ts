import { Injectable } from '@nestjs/common';
import Groq from "groq-sdk";

@Injectable()
export class AiService {

  private groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
  });

  async chat(prompt: string) {
  console.log("Prompt received:", prompt);

    const completion = await this.groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });
  console.log("Groq response:", completion);

    return completion.choices[0].message.content;
  }
}