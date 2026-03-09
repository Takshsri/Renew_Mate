import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {

  constructor(private aiService: AiService) {}

  @Post('chat')
  async chat(@Body('message') message: string) {

    const reply = await this.aiService.chat(message);

    return { reply };

}

}