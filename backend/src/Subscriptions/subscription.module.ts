import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { SubscriptionsService } from './subscription.service';
import { SubscriptionsController } from './subscription.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
   exports: [SubscriptionsService],
})
export class SubscriptionsModule {}