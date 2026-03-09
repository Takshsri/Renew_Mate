import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { SubscriptionsModule } from 'src/Subscriptions/subscription.module';

@Module({
  imports: [SubscriptionsModule],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}